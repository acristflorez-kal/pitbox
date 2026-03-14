import { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'
import { Store, Plus, Package, ShoppingBag, X, Save, Camera, Trash2 } from 'lucide-react'

const CATEGORIAS = ['cables', 'frenos', 'aceite', 'llantas', 'filtros', 'baterías', 'suspensión', 'otros']
const MAX_FOTOS = 3

const PanelRepuestero = ({ user }) => {
  const [repuestero, setRepuestero] = useState(null)
  const [productos, setProductos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('productos')
  const [showFormTienda, setShowFormTienda] = useState(false)
  const [showFormProducto, setShowFormProducto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [fotosPreview, setFotosPreview] = useState([])
  const [fotosArchivos, setFotosArchivos] = useState([])
  const fileInputRef = useRef(null)

  const [formTienda, setFormTienda] = useState({
    nombre_tienda: '', descripcion: '', direccion: '', distrito: '', ciudad: 'Lima', telefono: '', whatsapp: ''
  })
  const [formProducto, setFormProducto] = useState({
    nombre: '', descripcion: '', categoria: 'cables', marca: '', precio: '',
    precio_oferta: '', stock: '1', es_remate: false, compatible_marcas: '', compatible_modelos: ''
  })

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    const { data: rep } = await supabase.from('repuesteros').select('*').eq('usuario_id', user.id).single()
    setRepuestero(rep)
    if (rep) {
      const { data: prods } = await supabase.from('productos').select('*').eq('repuestero_id', rep.id).order('created_at', { ascending: false })
      setProductos(prods || [])
      const { data: ords } = await supabase.from('ordenes').select('*, productos(nombre), vehiculos(marca, modelo)').eq('repuestero_id', rep.id).order('created_at', { ascending: false })
      setOrdenes(ords || [])
    }
    setLoading(false)
  }

  const guardarTienda = async () => {
    if (!formTienda.nombre_tienda) return
    setGuardando(true)
    if (repuestero) {
      await supabase.from('repuesteros').update(formTienda).eq('id', repuestero.id)
    } else {
      await supabase.from('repuesteros').insert({ ...formTienda, usuario_id: user.id })
    }
    setShowFormTienda(false)
    await cargarDatos()
    setGuardando(false)
  }

  const agregarFoto = (e) => {
    const archivos = Array.from(e.target.files)
    if (fotosArchivos.length + archivos.length > MAX_FOTOS) {
      alert(`Máximo ${MAX_FOTOS} fotos por producto`)
      return
    }
    const nuevasVistas = archivos.map(f => URL.createObjectURL(f))
    setFotosPreview(prev => [...prev, ...nuevasVistas])
    setFotosArchivos(prev => [...prev, ...archivos])
  }

  const quitarFoto = (i) => {
    setFotosPreview(prev => prev.filter((_, idx) => idx !== i))
    setFotosArchivos(prev => prev.filter((_, idx) => idx !== i))
  }

  const subirFotos = async (productoId) => {
    const urls = []
    for (const archivo of fotosArchivos) {
      const ext = archivo.name.split('.').pop()
      const path = `${productoId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, archivo, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  const guardarProducto = async () => {
    if (!formProducto.nombre || !formProducto.precio) return
    setGuardando(true)
    const { data } = await supabase.from('productos').insert({
      ...formProducto,
      repuestero_id: repuestero.id,
      precio: parseFloat(formProducto.precio),
      precio_oferta: formProducto.precio_oferta ? parseFloat(formProducto.precio_oferta) : null,
      stock: parseInt(formProducto.stock) || 1
    }).select().single()

    if (data && fotosArchivos.length > 0) {
      const urls = await subirFotos(data.id)
      if (urls.length > 0) {
        await supabase.from('productos').update({ imagen_url: urls[0], fotos: urls }).eq('id', data.id)
      }
    }

    setFormProducto({ nombre: '', descripcion: '', categoria: 'cables', marca: '', precio: '', precio_oferta: '', stock: '1', es_remate: false, compatible_marcas: '', compatible_modelos: '' })
    setFotosPreview([])
    setFotosArchivos([])
    setShowFormProducto(false)
    await cargarDatos()
    setGuardando(false)
  }

  const cambiarEstadoOrden = async (ordenId, estado) => {
    await supabase.from('ordenes').update({ estado }).eq('id', ordenId)
    await cargarDatos()
  }

  const inp = { width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const lbl = { color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase' }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #222', borderTop: '3px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // Si no tiene tienda registrada
  if (!repuestero && !showFormTienda) return (
    <div style={{ color: 'white' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Panel Repuestero 🔧</h1>
      <div style={{ background: '#111', border: '1px dashed #333', borderRadius: 16, padding: 40, textAlign: 'center' }}>
        <Store size={48} style={{ color: '#333', margin: '0 auto 16px', display: 'block' }} />
        <p style={{ color: '#666', marginBottom: 20 }}>Registra tu tienda para empezar a vender en PitBox</p>
        <button onClick={() => setShowFormTienda(true)}
          style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Registrar mi tienda
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ color: 'white' }}>
      {/* Header tienda */}
      {repuestero && !showFormTienda && (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={22} style={{ color: 'white' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>{repuestero.nombre_tienda}</p>
                <p style={{ margin: 0, color: '#666', fontSize: 12 }}>{repuestero.distrito}, {repuestero.ciudad}</p>
              </div>
            </div>
            <button onClick={() => { setFormTienda(repuestero); setShowFormTienda(true) }}
              style={{ background: 'none', border: '1px solid #333', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 12, padding: '4px 10px' }}>
              Editar
            </button>
          </div>
        </div>
      )}

      {/* Formulario tienda */}
      {showFormTienda && (
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Datos de tu tienda</h3>
            {repuestero && <button onClick={() => setShowFormTienda(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={18} /></button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Nombre de tu tienda</label><input value={formTienda.nombre_tienda} onChange={e => setFormTienda({ ...formTienda, nombre_tienda: e.target.value })} placeholder="Repuestos El Mecánico" style={inp} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Descripción</label><input value={formTienda.descripcion} onChange={e => setFormTienda({ ...formTienda, descripcion: e.target.value })} placeholder="Especialistas en cables y repuestos" style={inp} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Dirección</label><input value={formTienda.direccion} onChange={e => setFormTienda({ ...formTienda, direccion: e.target.value })} placeholder="Av. Principal 123" style={inp} /></div>
            <div><label style={lbl}>Distrito</label><input value={formTienda.distrito} onChange={e => setFormTienda({ ...formTienda, distrito: e.target.value })} placeholder="La Victoria" style={inp} /></div>
            <div><label style={lbl}>Ciudad</label><input value={formTienda.ciudad} onChange={e => setFormTienda({ ...formTienda, ciudad: e.target.value })} placeholder="Lima" style={inp} /></div>
            <div><label style={lbl}>Teléfono</label><input value={formTienda.telefono} onChange={e => setFormTienda({ ...formTienda, telefono: e.target.value })} placeholder="01-234-5678" style={inp} /></div>
            <div><label style={lbl}>WhatsApp</label><input value={formTienda.whatsapp} onChange={e => setFormTienda({ ...formTienda, whatsapp: e.target.value })} placeholder="51 9XX XXX XXX" style={inp} /></div>
          </div>
          <button onClick={guardarTienda} disabled={guardando}
            style={{ width: '100%', marginTop: 16, padding: 12, background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Save size={16} />{guardando ? 'Guardando...' : 'Guardar tienda'}
          </button>
        </div>
      )}

      {repuestero && !showFormTienda && (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[['productos', Package, `Productos (${productos.length})`], ['ordenes', ShoppingBag, `Órdenes (${ordenes.filter(o => o.estado === 'pendiente').length} nuevas)`]].map(([id, Icon, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex: 1, padding: '10px', background: tab === id ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#111', border: tab === id ? 'none' : '1px solid #333', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          {/* Tab Productos */}
          {tab === 'productos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Mis productos</h3>
                <button onClick={() => setShowFormProducto(!showFormProducto)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  <Plus size={14} /> Agregar
                </button>
              </div>

              {showFormProducto && (
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: 14, padding: 18, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Nuevo producto</h4>
                    <button onClick={() => setShowFormProducto(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Nombre del producto</label><input value={formProducto.nombre} onChange={e => setFormProducto({ ...formProducto, nombre: e.target.value })} placeholder="Cable de acelerador Changan" style={inp} /></div>
                    <div><label style={lbl}>Categoría</label>
                      <select value={formProducto.categoria} onChange={e => setFormProducto({ ...formProducto, categoria: e.target.value })} style={inp}>
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label style={lbl}>Marca</label><input value={formProducto.marca} onChange={e => setFormProducto({ ...formProducto, marca: e.target.value })} placeholder="Verit" style={inp} /></div>
                    <div><label style={lbl}>Precio (S/)</label><input type="number" value={formProducto.precio} onChange={e => setFormProducto({ ...formProducto, precio: e.target.value })} placeholder="45.00" style={inp} /></div>
                    <div><label style={lbl}>Precio oferta (S/) — opcional</label><input type="number" value={formProducto.precio_oferta} onChange={e => setFormProducto({ ...formProducto, precio_oferta: e.target.value })} placeholder="35.00" style={inp} /></div>
                    <div><label style={lbl}>Stock disponible</label><input type="number" value={formProducto.stock} onChange={e => setFormProducto({ ...formProducto, stock: e.target.value })} placeholder="5" style={inp} /></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 18 }}>
                      <input type="checkbox" id="remate" checked={formProducto.es_remate} onChange={e => setFormProducto({ ...formProducto, es_remate: e.target.checked })} />
                      <label htmlFor="remate" style={{ color: '#f97316', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🔥 Es remate / liquidación</label>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Compatible con marcas de vehículo</label><input value={formProducto.compatible_marcas} onChange={e => setFormProducto({ ...formProducto, compatible_marcas: e.target.value })} placeholder="Toyota, Nissan, Changan" style={inp} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Compatible con modelos</label><input value={formProducto.compatible_modelos} onChange={e => setFormProducto({ ...formProducto, compatible_modelos: e.target.value })} placeholder="Hilux, Frontier, Gran Van" style={inp} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Descripción</label><input value={formProducto.descripcion} onChange={e => setFormProducto({ ...formProducto, descripcion: e.target.value })} placeholder="Original, garantía 6 meses" style={inp} /></div>

                    {/* FOTOS */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={lbl}>Fotos del producto (máx. {MAX_FOTOS})</label>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                        {fotosPreview.map((url, i) => (
                          <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                            <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #333' }} />
                            <button onClick={() => quitarFoto(i)}
                              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: '#ef4444', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {fotosPreview.length < MAX_FOTOS && (
                          <button onClick={() => fileInputRef.current?.click()}
                            style={{ width: 80, height: 80, background: '#1a1a1a', border: '1px dashed #444', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', color: '#666' }}>
                            <Camera size={20} />
                            <span style={{ fontSize: 10 }}>Agregar</span>
                          </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={agregarFoto} style={{ display: 'none' }} />
                      </div>
                    </div>
                  </div>
                  <button onClick={guardarProducto} disabled={guardando}
                    style={{ width: '100%', marginTop: 14, padding: 12, background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                    {guardando ? 'Guardando...' : 'Publicar producto'}
                  </button>
                </div>
              )}

              {productos.length === 0 ? (
                <div style={{ background: '#111', border: '1px dashed #333', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                  <Package size={36} style={{ color: '#333', margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ color: '#555', fontSize: 13 }}>Aún no tienes productos publicados</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {productos.map(p => (
                    <div key={p.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{p.nombre}</p>
                          {p.es_remate && <span style={{ background: '#f9731620', color: '#f97316', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>🔥 REMATE</span>}
                        </div>
                        <p style={{ margin: 0, color: '#666', fontSize: 12 }}>{p.categoria} · {p.marca} · Stock: {p.stock}</p>
                        {p.compatible_marcas && <p style={{ margin: '2px 0 0', color: '#555', fontSize: 11 }}>Compatible: {p.compatible_marcas}</p>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {p.precio_oferta ? (
                          <>
                            <p style={{ margin: 0, color: '#888', fontSize: 11, textDecoration: 'line-through' }}>S/ {p.precio}</p>
                            <p style={{ margin: 0, color: '#22c55e', fontWeight: 800, fontSize: 15 }}>S/ {p.precio_oferta}</p>
                          </>
                        ) : (
                          <p style={{ margin: 0, color: '#ef4444', fontWeight: 800, fontSize: 15 }}>S/ {p.precio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Órdenes */}
          {tab === 'ordenes' && (
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Órdenes de compra</h3>
              {ordenes.length === 0 ? (
                <div style={{ background: '#111', border: '1px dashed #333', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                  <ShoppingBag size={36} style={{ color: '#333', margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ color: '#555', fontSize: 13 }}>Aún no tienes órdenes</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ordenes.map(o => (
                    <div key={o.id} style={{ background: '#111', border: `1px solid ${o.estado === 'pendiente' ? '#f97316' : '#222'}`, borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{o.productos?.nombre || 'Producto'}</p>
                          <p style={{ margin: '2px 0 0', color: '#666', fontSize: 12 }}>{o.vehiculos ? `${o.vehiculos.marca} ${o.vehiculos.modelo}` : ''}</p>
                          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 12 }}>{o.nombre_comprador} · {o.telefono_comprador}</p>
                          {o.tipo_entrega === 'delivery' && <p style={{ margin: '2px 0 0', color: '#7c3aed', fontSize: 12 }}>🚚 Delivery: {o.direccion_entrega}</p>}
                          {o.notas && <p style={{ margin: '2px 0 0', color: '#666', fontSize: 11, fontStyle: 'italic' }}>{o.notas}</p>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#ef4444', fontWeight: 800 }}>S/ {o.precio_total}</p>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: o.estado === 'pendiente' ? '#f9731620' : o.estado === 'confirmado' ? '#22c55e20' : '#33333380', color: o.estado === 'pendiente' ? '#f97316' : o.estado === 'confirmado' ? '#22c55e' : '#888', fontWeight: 700 }}>{o.estado}</span>
                        </div>
                      </div>
                      {o.estado === 'pendiente' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => cambiarEstadoOrden(o.id, 'confirmado')}
                            style={{ flex: 1, padding: '8px', background: '#22c55e20', border: '1px solid #22c55e', borderRadius: 8, color: '#22c55e', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                            ✓ Confirmar
                          </button>
                          <button onClick={() => cambiarEstadoOrden(o.id, 'cancelado')}
                            style={{ flex: 1, padding: '8px', background: '#ef444420', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                            ✕ Cancelar
                          </button>
                        </div>
                      )}
                      {o.estado === 'confirmado' && (
                        <button onClick={() => cambiarEstadoOrden(o.id, 'entregado')}
                          style={{ width: '100%', padding: '8px', background: '#2563eb20', border: '1px solid #2563eb', borderRadius: 8, color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                          📦 Marcar como entregado
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PanelRepuestero
