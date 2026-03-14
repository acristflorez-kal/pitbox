import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Search, MapPin, ShoppingCart, X, Flame, ExternalLink, Check, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORIAS = ['todos', 'cables', 'frenos', 'aceite', 'llantas', 'filtros', 'baterías', 'suspensión', 'otros']

const Tienda = ({ user }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos')
  const [soloRemates, setSoloRemates] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [vehiculos, setVehiculos] = useState([])
  const [ordenando, setOrdenando] = useState(false)
  const [ordenExitosa, setOrdenExitosa] = useState(false)
  const [formOrden, setFormOrden] = useState({
    vehiculo_id: '', nombre: '', telefono: '', tipo_entrega: 'pickup', direccion_entrega: '', notas: '', cantidad: 1
  })

  useEffect(() => {
    cargarProductos()
    cargarVehiculos()
  }, [])

  const cargarProductos = async () => {
    const { data } = await supabase
      .from('productos')
      .select('*, repuesteros(nombre_tienda, direccion, distrito, ciudad, whatsapp, telefono)')
      .eq('activo', true)
      .order('es_remate', { ascending: false })
      .order('created_at', { ascending: false })
    setProductos(data || [])
    setLoading(false)
  }

  const cargarVehiculos = async () => {
    const { data } = await supabase.from('vehiculos').select('*').eq('usuario_id', user.id)
    setVehiculos(data || [])
    if (data?.length > 0) setFormOrden(prev => ({ ...prev, vehiculo_id: data[0].id }))
  }

  const productosFiltrados = productos.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.compatible_marcas || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.compatible_modelos || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.marca || '').toLowerCase().includes(busqueda.toLowerCase())
    const matchCategoria = categoriaFiltro === 'todos' || p.categoria === categoriaFiltro
    const matchRemate = !soloRemates || p.es_remate
    return matchBusqueda && matchCategoria && matchRemate
  })

  const crearOrden = async () => {
    if (!formOrden.nombre || !formOrden.telefono) return
    setOrdenando(true)
    const precio = productoSeleccionado.precio_oferta || productoSeleccionado.precio
    await supabase.from('ordenes').insert({
      comprador_id: user.id,
      repuestero_id: productoSeleccionado.repuestero_id,
      producto_id: productoSeleccionado.id,
      vehiculo_id: formOrden.vehiculo_id || null,
      cantidad: parseInt(formOrden.cantidad),
      precio_unitario: precio,
      precio_total: precio * parseInt(formOrden.cantidad),
      tipo_entrega: formOrden.tipo_entrega,
      nombre_comprador: formOrden.nombre,
      telefono_comprador: formOrden.telefono,
      direccion_entrega: formOrden.direccion_entrega,
      notas: formOrden.notas,
    })

    // Registrar en historial del vehículo
    if (formOrden.vehiculo_id) {
      await supabase.from('historial_compras').insert({
        vehiculo_id: formOrden.vehiculo_id,
        usuario_id: user.id,
        producto: productoSeleccionado.nombre,
        descripcion: productoSeleccionado.descripcion,
        precio: precio,
        tienda: productoSeleccionado.repuesteros?.nombre_tienda,
        fecha_compra: new Date().toISOString().split('T')[0]
      })
    }

    setOrdenando(false)
    setOrdenExitosa(true)
  }

  const inp = { width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #222', borderTop: '3px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px 0' }}>Tienda 🛒</h1>
      <p style={{ color: '#666', fontSize: 13, margin: '0 0 20px 0' }}>Encuentra repuestos cerca de ti al mejor precio</p>

      {/* Buscador */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Busca por nombre, marca o modelo de auto..."
          style={{ ...inp, paddingLeft: 36 }} />
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
        {CATEGORIAS.map(c => (
          <button key={c} onClick={() => setCategoriaFiltro(c)}
            style={{ padding: '6px 14px', background: categoriaFiltro === c ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#111', border: categoriaFiltro === c ? 'none' : '1px solid #333', borderRadius: 99, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
        <button onClick={() => setSoloRemates(!soloRemates)}
          style={{ padding: '6px 14px', background: soloRemates ? '#f9731630' : '#111', border: soloRemates ? '1px solid #f97316' : '1px solid #333', borderRadius: 99, color: soloRemates ? '#f97316' : '#888', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          🔥 Solo remates
        </button>
      </div>

      {/* Resultados */}
      <p style={{ color: '#555', fontSize: 12, marginBottom: 12 }}>{productosFiltrados.length} productos encontrados</p>

      {productosFiltrados.length === 0 ? (
        <div style={{ background: '#111', border: '1px dashed #333', borderRadius: 14, padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#555' }}>No se encontraron productos{busqueda ? ` para "${busqueda}"` : ''}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {productosFiltrados.map(p => {
            const fotos = p.fotos || (p.imagen_url ? [p.imagen_url] : [])
            return (
              <div key={p.id} style={{ background: '#111', border: `1px solid ${p.es_remate ? '#f97316' : '#222'}`, borderRadius: 14, overflow: 'hidden' }}>

                {/* Fotos */}
                {fotos.length > 0 && (
                  <div style={{ position: 'relative', height: 180, background: '#1a1a1a' }}>
                    <img src={fotos[0]} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {fotos.length > 1 && (
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 99, padding: '2px 8px', fontSize: 11, color: 'white' }}>
                        1 / {fotos.length}
                      </div>
                    )}
                    {p.es_remate && (
                      <div style={{ position: 'absolute', top: 10, left: 10, background: '#f97316', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flame size={11} /> REMATE
                      </div>
                    )}
                  </div>
                )}

                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{p.nombre}</p>
                        {p.es_remate && fotos.length === 0 && (
                          <span style={{ background: '#f9731625', border: '1px solid #f97316', color: '#f97316', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>🔥 REMATE</span>
                        )}
                      </div>
                      {p.marca && <p style={{ margin: '0 0 2px', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>Marca: {p.marca}</p>}
                      {p.compatible_marcas && <p style={{ margin: '0 0 2px', color: '#666', fontSize: 12 }}>Compatible: {p.compatible_marcas}</p>}
                      {p.descripcion && <p style={{ margin: '0 0 4px', color: '#555', fontSize: 12 }}>{p.descripcion}</p>}
                      <p style={{ margin: 0, color: '#444', fontSize: 11 }}>Stock: {p.stock} uds.</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      {p.precio_oferta ? (
                        <>
                          <p style={{ margin: 0, color: '#555', fontSize: 11, textDecoration: 'line-through' }}>S/ {p.precio}</p>
                          <p style={{ margin: 0, color: '#22c55e', fontWeight: 900, fontSize: 22 }}>S/ {p.precio_oferta}</p>
                        </>
                      ) : (
                        <p style={{ margin: 0, color: '#ef4444', fontWeight: 900, fontSize: 22 }}>S/ {p.precio}</p>
                      )}
                    </div>
                  </div>

                  {/* Tienda */}
                  {p.repuesteros && (
                    <div style={{ background: '#1a1a1a', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13 }}>🏪 {p.repuesteros.nombre_tienda}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <MapPin size={12} style={{ color: '#555' }} />
                        <p style={{ margin: 0, color: '#666', fontSize: 12 }}>{p.repuesteros.direccion}, {p.repuesteros.distrito}</p>
                      </div>
                      <a href={`https://www.google.com/maps/search/${encodeURIComponent((p.repuesteros.direccion || '') + ' ' + (p.repuesteros.distrito || '') + ' Lima Peru')}`}
                        target="_blank" rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#2563eb', fontSize: 12, textDecoration: 'none' }}>
                        <ExternalLink size={11} /> Ver en Google Maps
                      </a>
                    </div>
                  )}

                  {/* Solo botón comprar — WhatsApp aparece DESPUÉS de la orden */}
                  <button onClick={() => { setProductoSeleccionado(p); setOrdenExitosa(false) }}
                    style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <ShoppingCart size={15} /> Hacer pedido
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal orden de compra */}
      {productoSeleccionado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#111', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            {!ordenExitosa ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontWeight: 800 }}>Confirmar pedido</h3>
                  <button onClick={() => setProductoSeleccionado(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 700 }}>{productoSeleccionado.nombre}</p>
                  <p style={{ margin: 0, color: '#ef4444', fontWeight: 800, fontSize: 18 }}>S/ {productoSeleccionado.precio_oferta || productoSeleccionado.precio}</p>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: 12 }}>🏪 {productoSeleccionado.repuesteros?.nombre_tienda} · {productoSeleccionado.repuesteros?.distrito}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {vehiculos.length > 0 && (
                    <div>
                      <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Vehículo</label>
                      <select value={formOrden.vehiculo_id} onChange={e => setFormOrden({ ...formOrden, vehiculo_id: e.target.value })} style={inp}>
                        <option value="">Sin vehículo</option>
                        {vehiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo} {v.año}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Tu nombre</label>
                    <input value={formOrden.nombre} onChange={e => setFormOrden({ ...formOrden, nombre: e.target.value })} placeholder="Juan Pérez" style={inp} />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Tu WhatsApp</label>
                    <input value={formOrden.telefono} onChange={e => setFormOrden({ ...formOrden, telefono: e.target.value })} placeholder="51 9XX XXX XXX" style={inp} />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Entrega</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[['pickup', '🏪 Recojo en tienda'], ['delivery', '🚚 Delivery']].map(([val, label]) => (
                        <button key={val} onClick={() => setFormOrden({ ...formOrden, tipo_entrega: val })}
                          style={{ flex: 1, padding: '10px', background: formOrden.tipo_entrega === val ? '#ef444420' : '#1a1a1a', border: `1px solid ${formOrden.tipo_entrega === val ? '#ef4444' : '#333'}`, borderRadius: 8, color: formOrden.tipo_entrega === val ? '#ef4444' : '#888', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formOrden.tipo_entrega === 'delivery' && (
                    <div>
                      <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Dirección de entrega</label>
                      <input value={formOrden.direccion_entrega} onChange={e => setFormOrden({ ...formOrden, direccion_entrega: e.target.value })} placeholder="Av. Tu dirección, distrito" style={inp} />
                    </div>
                  )}
                  <div>
                    <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Notas (opcional)</label>
                    <input value={formOrden.notas} onChange={e => setFormOrden({ ...formOrden, notas: e.target.value })} placeholder="Ej: urgente, llámame antes de enviar" style={inp} />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Cantidad</label>
                    <input type="number" min="1" max={productoSeleccionado.stock} value={formOrden.cantidad} onChange={e => setFormOrden({ ...formOrden, cantidad: e.target.value })} style={{ ...inp, width: 80 }} />
                  </div>
                </div>

                <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 12, margin: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Total</span>
                    <span style={{ fontWeight: 900, color: '#ef4444', fontSize: 18 }}>
                      S/ {((productoSeleccionado.precio_oferta || productoSeleccionado.precio) * (parseInt(formOrden.cantidad) || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button onClick={crearOrden} disabled={ordenando || !formOrden.nombre || !formOrden.telefono}
                  style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', opacity: (!formOrden.nombre || !formOrden.telefono) ? 0.5 : 1 }}>
                  {ordenando ? 'Procesando...' : 'Confirmar pedido'}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, background: '#22c55e20', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} style={{ color: '#22c55e' }} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>¡Pedido enviado! 🎉</h3>
                <p style={{ color: '#666', margin: '0 0 20px' }}>El repuestero revisará tu pedido y te contactará por WhatsApp.</p>
                {productoSeleccionado.repuesteros?.whatsapp && (
                  <a href={`https://wa.me/${productoSeleccionado.repuesteros.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, acabo de hacer un pedido en PitBox por "${productoSeleccionado.nombre}". Mi nombre es ${formOrden.nombre}.`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#25d366', border: 'none', borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none', marginBottom: 12 }}>
                    💬 Contactar por WhatsApp
                  </a>
                )}
                <br />
                <button onClick={() => { setProductoSeleccionado(null); setOrdenExitosa(false) }}
                  style={{ padding: '10px 20px', background: 'none', border: '1px solid #333', borderRadius: 10, color: '#888', cursor: 'pointer', marginTop: 8 }}>
                  Volver a la tienda
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Tienda
