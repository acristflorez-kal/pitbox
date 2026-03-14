import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Car, Plus, X, ChevronDown, ChevronUp, Wrench, Save, Trash2 } from 'lucide-react'

const MiGarage = ({ user }) => {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [vehiculoExpandido, setVehiculoExpandido] = useState(null)
  const [mantenimientos, setMantenimientos] = useState({})
  const [showMantForm, setShowMantForm] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const [formVeh, setFormVeh] = useState({ marca: '', modelo: '', año: '', placa: '', combustible: 'gasolina' })
  const [formMant, setFormMant] = useState({ tipo: '', fecha_realizado: '', kilometraje: '', costo: '', notas: '', proxima_fecha: '' })

  useEffect(() => { cargarVehiculos() }, [])

  const cargarVehiculos = async () => {
    const { data } = await supabase.from('vehiculos').select('*').eq('usuario_id', user.id).order('created_at')
    setVehiculos(data || [])
    setLoading(false)
  }

  const cargarMantenimientos = async (vehiculoId) => {
    const { data } = await supabase.from('mantenimientos').select('*').eq('vehiculo_id', vehiculoId).order('fecha_realizado', { ascending: false })
    setMantenimientos(prev => ({ ...prev, [vehiculoId]: data || [] }))
  }

  const toggleVehiculo = async (id) => {
    if (vehiculoExpandido === id) {
      setVehiculoExpandido(null)
    } else {
      setVehiculoExpandido(id)
      if (!mantenimientos[id]) await cargarMantenimientos(id)
    }
  }

  const guardarVehiculo = async () => {
    if (!formVeh.marca || !formVeh.modelo) { alert('Marca y modelo son requeridos'); return }
    setGuardando(true)
    await supabase.from('vehiculos').insert({ ...formVeh, usuario_id: user.id, año: parseInt(formVeh.año) || null })
    setFormVeh({ marca: '', modelo: '', año: '', placa: '', combustible: 'gasolina' })
    setShowForm(false)
    await cargarVehiculos()
    setGuardando(false)
  }

  const guardarMantenimiento = async (vehiculoId) => {
    if (!formMant.tipo) { alert('El tipo de mantenimiento es requerido'); return }
    setGuardando(true)
    await supabase.from('mantenimientos').insert({ ...formMant, vehiculo_id: vehiculoId, kilometraje: parseInt(formMant.kilometraje) || null, costo: parseFloat(formMant.costo) || null })
    setFormMant({ tipo: '', fecha_realizado: '', kilometraje: '', costo: '', notas: '', proxima_fecha: '' })
    setShowMantForm(null)
    await cargarMantenimientos(vehiculoId)
    setGuardando(false)
  }

  const eliminarVehiculo = async (id) => {
    if (!confirm('¿Eliminar este vehículo y todo su historial?')) return
    await supabase.from('mantenimientos').delete().eq('vehiculo_id', id)
    await supabase.from('vehiculos').delete().eq('id', id)
    await cargarVehiculos()
  }

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #222', borderTop: '3px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Mi Garage 🏎️</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Formulario nuevo vehículo */}
      {showForm && (
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Nuevo vehículo</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>Marca</label><input value={formVeh.marca} onChange={e => setFormVeh({ ...formVeh, marca: e.target.value })} placeholder="Toyota" style={inputStyle} /></div>
            <div><label style={labelStyle}>Modelo</label><input value={formVeh.modelo} onChange={e => setFormVeh({ ...formVeh, modelo: e.target.value })} placeholder="Hilux" style={inputStyle} /></div>
            <div><label style={labelStyle}>Año</label><input value={formVeh.año} onChange={e => setFormVeh({ ...formVeh, año: e.target.value })} placeholder="2020" type="number" style={inputStyle} /></div>
            <div><label style={labelStyle}>Placa</label><input value={formVeh.placa} onChange={e => setFormVeh({ ...formVeh, placa: e.target.value })} placeholder="ABC-123" style={inputStyle} /></div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Combustible</label>
              <select value={formVeh.combustible} onChange={e => setFormVeh({ ...formVeh, combustible: e.target.value })} style={{ ...inputStyle }}>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diésel</option>
                <option value="gas">Gas</option>
                <option value="electrico">Eléctrico</option>
              </select>
            </div>
          </div>
          <button onClick={guardarVehiculo} disabled={guardando}
            style={{ width: '100%', marginTop: 16, padding: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Save size={16} />{guardando ? 'Guardando...' : 'Guardar vehículo'}
          </button>
        </div>
      )}

      {/* Lista de vehículos */}
      {vehiculos.length === 0 ? (
        <div style={{ background: '#111', border: '1px dashed #333', borderRadius: 16, padding: 40, textAlign: 'center' }}>
          <Car size={48} style={{ color: '#333', margin: '0 auto 12px' }} />
          <p style={{ color: '#555' }}>No tienes vehículos registrados aún</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {vehiculos.map(v => (
            <div key={v.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 16, overflow: 'hidden' }}>
              <div onClick={() => toggleVehiculo(v.id)}
                style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Car size={22} style={{ color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{v.marca} {v.modelo}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: 12 }}>{v.año} · {v.placa || 'Sin placa'} · {v.combustible}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={(e) => { e.stopPropagation(); eliminarVehiculo(v.id) }}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={16} />
                  </button>
                  {vehiculoExpandido === v.id ? <ChevronUp size={18} style={{ color: '#666' }} /> : <ChevronDown size={18} style={{ color: '#666' }} />}
                </div>
              </div>

              {/* Historial de mantenimientos */}
              {vehiculoExpandido === v.id && (
                <div style={{ borderTop: '1px solid #222', padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#aaa' }}>Historial de mantenimiento</h4>
                    <button onClick={() => setShowMantForm(showMantForm === v.id ? null : v.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      <Plus size={12} /> Agregar
                    </button>
                  </div>

                  {/* Formulario mantenimiento */}
                  {showMantForm === v.id && (
                    <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Tipo de mantenimiento</label><input value={formMant.tipo} onChange={e => setFormMant({ ...formMant, tipo: e.target.value })} placeholder="Cambio de aceite, frenos, etc." style={inputStyle} /></div>
                        <div><label style={labelStyle}>Fecha realizado</label><input value={formMant.fecha_realizado} onChange={e => setFormMant({ ...formMant, fecha_realizado: e.target.value })} type="date" style={inputStyle} /></div>
                        <div><label style={labelStyle}>Próxima fecha</label><input value={formMant.proxima_fecha} onChange={e => setFormMant({ ...formMant, proxima_fecha: e.target.value })} type="date" style={inputStyle} /></div>
                        <div><label style={labelStyle}>Kilometraje</label><input value={formMant.kilometraje} onChange={e => setFormMant({ ...formMant, kilometraje: e.target.value })} placeholder="50000" type="number" style={inputStyle} /></div>
                        <div><label style={labelStyle}>Costo (S/)</label><input value={formMant.costo} onChange={e => setFormMant({ ...formMant, costo: e.target.value })} placeholder="150.00" type="number" style={inputStyle} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Notas</label><input value={formMant.notas} onChange={e => setFormMant({ ...formMant, notas: e.target.value })} placeholder="Observaciones adicionales" style={inputStyle} /></div>
                      </div>
                      <button onClick={() => guardarMantenimiento(v.id)} disabled={guardando}
                        style={{ width: '100%', marginTop: 12, padding: '10px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                        {guardando ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  )}

                  {/* Lista mantenimientos */}
                  {(mantenimientos[v.id] || []).length === 0 ? (
                    <p style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>Sin registros de mantenimiento</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(mantenimientos[v.id] || []).map(m => (
                        <div key={m.id} style={{ background: '#222', borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{m.tipo}</p>
                              {m.fecha_realizado && <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: 12 }}>Realizado: {new Date(m.fecha_realizado).toLocaleDateString('es-PE')}</p>}
                              {m.notas && <p style={{ margin: '4px 0 0 0', color: '#777', fontSize: 12 }}>{m.notas}</p>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {m.costo && <p style={{ margin: 0, color: '#ef4444', fontWeight: 700, fontSize: 13 }}>S/ {m.costo}</p>}
                              {m.proxima_fecha && <p style={{ margin: '2px 0 0 0', color: '#f97316', fontSize: 11 }}>Próximo: {new Date(m.proxima_fecha).toLocaleDateString('es-PE')}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default MiGarage
