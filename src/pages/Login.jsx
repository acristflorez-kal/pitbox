import { useState } from 'react'
import { supabase } from '../services/supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [nombre, setNombre] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await supabase.from('usuarios_pitbox').insert({
            auth_id: data.user.id,
            nombre,
            email
          })
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (e) {
      setError(e.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: 'white' }}>P</div>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: -1 }}>PitBox</span>
          </div>
          <p style={{ color: '#666', fontSize: 14 }}>Tu pit stop inteligente 🏎️</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 20, padding: 32 }}>
          <h2 style={{ color: 'white', fontWeight: 700, fontSize: 20, marginBottom: 24, textAlign: 'center' }}>
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          {isRegister && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#999', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>NOMBRE</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                style={{ width: '100%', padding: '12px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#999', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com" type="email"
              style={{ width: '100%', padding: '12px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#999', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>CONTRASEÑA</label>
            <input value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" type="password"
              style={{ width: '100%', padding: '12px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#666', fontSize: 14 }}>
            {isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            <span onClick={() => { setIsRegister(!isRegister); setError('') }}
              style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>
              {isRegister ? 'Iniciar sesión' : 'Regístrate gratis'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
