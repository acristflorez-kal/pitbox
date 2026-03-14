import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Car, Wrench, Bell, ChevronRight, Plus, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = ({ user }) => {
  const [nombre, setNombre] = useState('')
  const [vehiculos, setVehiculos] = useState([])
  const [proximosMantenimientos, setProximosMantenimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    try {
      const { data: perfil } = await supabase.from('usuarios_pitbox').select('nombre').eq('auth_id', user.id).single()
      if (perfil) setNombre(perfil.nombre)

      const { data: veh } = await supabase.from('vehiculos').select('*').eq('usuario_id', user.id)
      setVehiculos(veh || [])

      if (veh?.length > 0) {
        const ids = veh.map(v => v.id)
        const hoy = new Date().toISOString().split('T')[0]
        const en30dias = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const { data: mant } = await supabase.from('mantenimientos')
          .select('*, vehiculos(marca, modelo)')
          .in('vehiculo_id', ids)
          .lte('proxima_fecha', en30dias)
          .gte('proxima_fecha', hoy)
          .order('proxima_fecha')
        setProximosMantenimientos(mant || [])
      }
    } finally { setLoading(false) }
  }

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #222', borderTop: '3px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ color: 'white' }}>

      {/* Saludo */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{saludo}, {nombre?.split(' ')[0] || 'Piloto'} 👋</h1>
        <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0 0' }}>Bienvenido a tu pit stop inteligente</p>
      </div>

      {/* Alertas de mantenimiento */}
      {proximosMantenimientos.length > 0 && (
        <div style={{ background: '#1a0a00', border: '1px solid #f97316', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Bell style={{ color: '#f97316' }} size={18} />
            <p style={{ color: '#f97316', fontWeight: 700, margin: 0, fontSize: 14 }}>Próximos mantenimientos</p>
          </div>
          {proximosMantenimientos.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #2a1500' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'white' }}>{m.tipo}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#666' }}>{m.vehiculos?.marca} {m.vehiculos?.modelo}</p>
              </div>
              <span style={{ fontSize: 12, color: '#f97316', fontWeight: 700 }}>
                {new Date(m.proxima_fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Mis vehículos */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Mi Garage</h2>
          <button onClick={() => navigate('/garage')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            Ver todo <ChevronRight size={14} />
          </button>
        </div>

        {vehiculos.length === 0 ? (
          <div style={{ background: '#111', border: '1px dashed #333', borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <Car size={40} style={{ color: '#333', margin: '0 auto 12px' }} />
            <p style={{ color: '#555', fontSize: 14, margin: '0 0 16px 0' }}>No tienes vehículos registrados</p>
            <button onClick={() => navigate('/garage')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              <Plus size={16} /> Agregar vehículo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vehiculos.slice(0, 2).map(v => (
              <div key={v.id} onClick={() => navigate('/garage')}
                style={{ background: '#111', border: '1px solid #222', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={22} style={{ color: 'white' }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{v.marca} {v.modelo}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: 12 }}>{v.año} · {v.placa || 'Sin placa'}</p>
                </div>
                <ChevronRight size={18} style={{ color: '#444', marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compartir PitBox */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => {
            const url = 'https://pitbox.app'
            const texto = `🏎️ ¡Uso PitBox para el mantenimiento de mi auto y es increíble! Nunca más me olvido del cambio de aceite. Tiene asistente mecánico con IA y es gratis. Pruébalo: ${url}`
            if (navigator.share) {
              navigator.share({ title: 'PitBox', text: texto, url })
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
            }
          }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#0f1f0f', border: '1px solid #25d366', borderRadius: 14, color: '#25d366', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          <Share2 size={16} /> Comparte PitBox con amigos 🚀
        </button>
      </div>

      {/* Acceso rápido al asistente */}
      <div onClick={() => navigate('/asistente')}
        style={{ background: 'linear-gradient(135deg, #1a0000, #0a0a1a)', border: '1px solid #333', borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Wrench size={24} style={{ color: 'white' }} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Asistente Mecánico IA</p>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 13 }}>¿Tienes algún problema con tu vehículo? Pregúntame</p>
        </div>
        <ChevronRight size={18} style={{ color: '#444', marginLeft: 'auto' }} />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default Home
