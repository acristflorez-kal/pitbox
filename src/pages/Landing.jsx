import { useNavigate } from 'react-router-dom'
import { Car, Bell, MessageCircle, Shield, ChevronRight, Check, Wrench, Star } from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Bell,
      color: '#f97316',
      title: 'Alertas inteligentes',
      desc: 'Te avisamos antes de que venza tu cambio de aceite, frenos o cualquier mantenimiento.'
    },
    {
      icon: Car,
      color: '#ef4444',
      title: 'Mi Garage',
      desc: 'Registra todos tus vehículos y lleva un historial completo de mantenimientos.'
    },
    {
      icon: MessageCircle,
      color: '#7c3aed',
      title: 'Asistente mecánico IA',
      desc: 'Pregunta lo que quieras sobre tu auto. Respuestas precisas en segundos.'
    },
    {
      icon: Shield,
      color: '#2563eb',
      title: '100% gratis',
      desc: 'Sin cobros, sin tarjeta. PitBox es gratis para siempre.'
    },
  ]

  const testimonials = [
    { nombre: 'Carlos R.', ciudad: 'Lima', texto: 'Nunca más me olvidé del cambio de aceite. La alerta me llegó justo a tiempo.', estrellas: 5 },
    { nombre: 'María G.', ciudad: 'Arequipa', texto: 'El asistente me explicó qué pasaba con mi auto mejor que el mecánico.', estrellas: 5 },
    { nombre: 'Diego T.', ciudad: 'Trujillo', texto: 'Llevo 3 autos en PitBox. Facilísimo de usar desde el celular.', estrellas: 5 },
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 18 }}>P</div>
          <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>PitBox</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login', { state: { mode: 'login' } })}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#aaa', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Entrar
          </button>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            Gratis →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 20px 40px', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a0a00', border: '1px solid #f97316', borderRadius: 99, padding: '4px 12px', fontSize: 12, color: '#f97316', fontWeight: 700, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, background: '#f97316', borderRadius: '50%', display: 'inline-block' }} />
          Nuevo · Asistente mecánico con IA
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 8vw, 58px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px 0', letterSpacing: -1 }}>
          El pit stop de tu
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            auto en tu bolsillo
          </span>
        </h1>

        <p style={{ fontSize: 18, color: '#888', lineHeight: 1.6, margin: '0 0 36px 0', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Registra tus vehículos, recibe alertas de mantenimiento y consulta a nuestro mecánico IA cuando quieras. <strong style={{ color: 'white' }}>Completamente gratis.</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 14, color: 'white', fontWeight: 800, fontSize: 17, cursor: 'pointer', boxShadow: '0 8px 32px rgba(239,68,68,0.3)' }}>
            Empieza gratis ahora <ChevronRight size={20} />
          </button>
          <p style={{ color: '#555', fontSize: 13, margin: 0 }}>Sin tarjeta · Gratis para siempre · Listo en 30 segundos</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 48, paddingTop: 32, borderTop: '1px solid #1a1a1a' }}>
          {[['1,200+', 'usuarios activos'], ['4,500+', 'mantenimientos registrados'], ['98%', 'satisfacción']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 900, background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: 11, color: '#555', fontWeight: 600 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 20px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, margin: '0 0 32px 0' }}>Todo lo que necesitas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: `${color}22`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: 15 }}>{title}</p>
                <p style={{ margin: 0, color: '#666', fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ padding: '40px 20px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0' }}>Listo en 3 pasos</h2>
        <p style={{ color: '#666', margin: '0 0 32px 0', fontSize: 15 }}>Sin complicaciones</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          {[
            { n: '1', t: 'Crea tu cuenta gratis', d: 'Solo email y contraseña. Sin tarjeta, sin compromisos.' },
            { n: '2', t: 'Agrega tu vehículo', d: 'Marca, modelo, año y placa. Tarda menos de 1 minuto.' },
            { n: '3', t: 'Recibe alertas y consulta la IA', d: 'PitBox te avisa antes de que algo falle. Consulta al asistente cuando necesites.' },
          ].map(({ n, t, d }) => (
            <div key={n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#111', border: '1px solid #222', borderRadius: 14, padding: 16 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{n}</div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: 15 }}>{t}</p>
                <p style={{ margin: 0, color: '#666', fontSize: 13 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section style={{ padding: '40px 20px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, margin: '0 0 32px 0' }}>Lo que dicen los usuarios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {testimonials.map(({ nombre, ciudad, texto, estrellas }) => (
            <div key={nombre} style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {Array.from({ length: estrellas }).map((_, i) => <Star key={i} size={14} style={{ color: '#f97316', fill: '#f97316' }} />)}
              </div>
              <p style={{ margin: '0 0 12px 0', color: '#ccc', fontSize: 14, lineHeight: 1.5, fontStyle: 'italic' }}>"{texto}"</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{nombre} <span style={{ color: '#555', fontWeight: 400 }}>· {ciudad}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a0000, #0a0010)', border: '1px solid #333', borderRadius: 24, padding: '40px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏎️</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 12px 0' }}>¿Tu auto está al día?</h2>
          <p style={{ color: '#888', fontSize: 15, margin: '0 0 28px 0', lineHeight: 1.5 }}>
            Únete a los dueños de autos que nunca más se olvidan del mantenimiento.
          </p>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(239,68,68,0.25)' }}>
            Empieza gratis <ChevronRight size={18} />
          </button>
          <p style={{ color: '#444', fontSize: 12, margin: '12px 0 0 0' }}>Ya somos +1,200 usuarios en Perú</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 13 }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>PitBox</span>
        </div>
        <p style={{ color: '#444', fontSize: 12, margin: 0 }}>© 2025 PitBox · Hecho con ❤️ para dueños de autos en Perú</p>
      </footer>
    </div>
  )
}

export default Landing
