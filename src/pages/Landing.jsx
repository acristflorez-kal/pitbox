import { useNavigate } from 'react-router-dom'
import { ChevronRight, Star, Bell, Search, TrendingDown, Camera, Store, Wrench, ShieldCheck } from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()

  const secondaryValues = [
    {
      emoji: '🛒',
      title: 'Encuentra el mejor precio',
      desc: 'Compara precios de repuestos en tiendas cerca de ti. Ve quién lo tiene más barato y dónde está antes de salir de casa.',
      color: '#ef4444'
    },
    {
      emoji: '🤖',
      title: 'Pregúntale a la IA mecánica',
      desc: 'Describe el problema de tu auto y recibe un diagnóstico al instante. Sabe qué tiendas tienen el repuesto que necesitas.',
      color: '#7c3aed'
    },
    {
      emoji: '🔔',
      title: 'Alertas antes de que falle',
      desc: 'PitBox registra tus mantenimientos y te avisa antes de que venza el aceite, los frenos o cualquier revisión importante.',
      color: '#f97316'
    },
    {
      emoji: '🔥',
      title: 'Vende lo que no usas',
      desc: 'Tienes repuestos guardados que no usas? Publícalos en 30 segundos y llega a miles de dueños de autos buscando exactamente eso.',
      color: '#f97316'
    },
    {
      emoji: '🏪',
      title: '¿Eres repuestero?',
      desc: 'Sube tu catálogo y vende más. Tus productos aparecen cuando alguien busca lo que tienes. Sin local virtual, sin mensualidad.',
      color: '#22c55e'
    },
    {
      emoji: '📍',
      title: 'El más cercano y el más barato',
      desc: 'PitBox te muestra dónde está el repuesto en tu ciudad, a qué precio y cómo llegar. Tú decides si lo recoges o pides delivery.',
      color: '#2563eb'
    },
  ]

  const testimonials = [
    { nombre: 'Carlos R.', ciudad: 'Lima', texto: 'Encontré el cable de acelerador de mi Changan 40 soles más barato que en el mecánico. En La Victoria, a 10 minutos.', estrellas: 5 },
    { nombre: 'María G.', ciudad: 'Arequipa', texto: 'Vendí 3 repuestos que tenía guardados hace 2 años. Los publiqué en el almuerzo y a la noche ya tenía comprador.', estrellas: 5 },
    { nombre: 'Diego T.', ciudad: 'Trujillo', texto: 'El asistente me dijo exactamente qué pasaba con mi auto y me mandó directo a la tienda más barata. Increíble.', estrellas: 5 },
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      {/* HERO */}
      <section style={{ padding: '56px 20px 40px', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>

        {/* Badge urgencia */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a0000', border: '1px solid #ef4444', borderRadius: 99, padding: '4px 14px', fontSize: 12, color: '#ef4444', fontWeight: 700, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          +1,200 dueños de autos ya lo usan en Perú
        </div>

        {/* TÍTULO PRINCIPAL */}
        <h1 style={{ fontSize: 'clamp(34px, 8vw, 56px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 10px 0', letterSpacing: -1.5 }}>
          Deja de pagar de más
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            por tus repuestos.
          </span>
        </h1>

        {/* SUBTÍTULO */}
        <p style={{ fontSize: 18, color: '#777', lineHeight: 1.6, margin: '16px auto 12px', maxWidth: 500 }}>
          PitBox encuentra el mejor precio cerca de ti,{' '}
          <strong style={{ color: '#ccc' }}>registra todo lo que le haces a tu auto</strong>{' '}
          y te avisa antes de que algo falle.
        </p>

        {/* Línea secundaria - el gancho vendedor */}
        <p style={{ fontSize: 15, color: '#555', margin: '0 auto 36px', maxWidth: 460 }}>
          Y si tienes repuestos que no usas —{' '}
          <span style={{ color: '#f97316', fontWeight: 700 }}>véndelos hoy mismo. 🔥</span>
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 28px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 14, color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 32px rgba(239,68,68,0.35)' }}>
            Buscar repuestos <ChevronRight size={18} />
          </button>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 28px', background: '#111', border: '1px solid #f97316', borderRadius: 14, color: '#f97316', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
            🔥 Quiero vender
          </button>
        </div>

        <p style={{ color: '#444', fontSize: 13, margin: '14px 0 0' }}>Gratis · Sin tarjeta · Listo en 30 segundos</p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 44, paddingTop: 28, borderTop: '1px solid #1a1a1a' }}>
          {[['1,200+', 'usuarios activos'], ['4,500+', 'repuestos vendidos'], ['98%', 'satisfacción']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#444', fontWeight: 600 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMA → SOLUCIÓN */}
      <section style={{ padding: '20px 20px 40px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a0000, #0a000a)', border: '1px solid #2a1a1a', borderRadius: 20, padding: '28px 24px' }}>
          <p style={{ fontSize: 22, fontWeight: 900, margin: '0 0 8px' }}>¿Cuánto pagaste de más<br />en tu último repuesto?</p>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
            El 70% de dueños de autos no sabe que el mismo repuesto está <strong style={{ color: '#ef4444' }}>30% más barato</strong> a 15 minutos de distancia.
          </p>
          <p style={{ color: '#f97316', fontWeight: 700, fontSize: 15, margin: 0 }}>PitBox te muestra dónde está y a cuánto. Antes de que salgas.</p>
        </div>
      </section>

      {/* SECONDARY VALUES - Lo que también puedes hacer */}
      <section style={{ padding: '20px 20px 40px', maxWidth: 680, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#555', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 8px' }}>y además...</p>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, margin: '0 0 28px' }}>PitBox es más que buscar repuestos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {secondaryValues.map(({ emoji, title, desc, color }) => (
            <div key={title} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
              <p style={{ margin: '0 0 8px', fontWeight: 800, fontSize: 15, color: 'white' }}>{title}</p>
              <p style={{ margin: 0, color: '#666', fontSize: 13, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VENDER - sección especial */}
      <section style={{ padding: '10px 20px 40px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #0a0a00, #1a0800)', border: '1px solid #f97316', borderRadius: 20, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔥</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 12px' }}>¿Tienes repuestos guardados?</h2>
          <p style={{ color: '#888', fontSize: 15, margin: '0 0 10px', lineHeight: 1.6 }}>
            Cada día que pasan en tu almacén valen menos. <strong style={{ color: '#f97316' }}>Publícalos en 30 segundos</strong> y llega a miles de dueños de autos buscando exactamente lo que tienes.
          </p>
          <p style={{ color: '#666', fontSize: 13, margin: '0 0 24px' }}>
            También si eres repuestero: sube tu catálogo y vende sin local virtual, sin mensualidad.
          </p>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg, #f97316, #ef4444)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
            Publicar mi primer repuesto <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section style={{ padding: '10px 20px 40px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px' }}>Tan simple como debe ser</h2>
        <p style={{ color: '#555', margin: '0 0 28px', fontSize: 14 }}>Tres pasos. Menos de un minuto.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
          {[
            { n: '1', t: 'Crea tu cuenta gratis', d: 'Solo email y contraseña. Sin tarjeta, sin trámites.' },
            { n: '2', t: 'Dinos qué necesitas', d: 'Busca un repuesto, consulta al asistente, o sube lo que quieres vender.' },
            { n: '3', t: 'Ahorra o cobra', d: 'Encuentra el mejor precio cerca de ti, o recibe tu primer pedido hoy.' },
          ].map(({ n, t, d }) => (
            <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: 16 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{n}</div>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15 }}>{t}</p>
                <p style={{ margin: 0, color: '#555', fontSize: 13 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: '10px 20px 40px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, margin: '0 0 24px' }}>Lo que dicen los usuarios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {testimonials.map(({ nombre, ciudad, texto, estrellas }) => (
            <div key={nombre} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {Array.from({ length: estrellas }).map((_, i) => <Star key={i} size={14} style={{ color: '#f97316', fill: '#f97316' }} />)}
              </div>
              <p style={{ margin: '0 0 12px', color: '#bbb', fontSize: 14, lineHeight: 1.55, fontStyle: 'italic' }}>"{texto}"</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{nombre} <span style={{ color: '#444', fontWeight: 400 }}>· {ciudad}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '10px 20px 60px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 24, padding: '40px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏎️</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 12px' }}>Tu auto lo vale.<br />Tu bolsillo también.</h2>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
            Únete a los dueños de autos que ya no pagan de más ni olvidan el mantenimiento.
          </p>
          <button onClick={() => navigate('/login', { state: { mode: 'register' } })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(239,68,68,0.25)' }}>
            Empieza gratis <ChevronRight size={18} />
          </button>
          <p style={{ color: '#333', fontSize: 12, margin: '12px 0 0' }}>Sin tarjeta · Gratis para siempre</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 13 }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>PitBox</span>
        </div>
        <p style={{ color: '#333', fontSize: 12, margin: 0 }}>© 2025 PitBox · Hecho en Perú 🇵🇪</p>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </div>
  )
}

export default Landing
