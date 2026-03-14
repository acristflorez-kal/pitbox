import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './services/supabase'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Home from './pages/Home'
import MiGarage from './pages/MiGarage'
import Asistente from './pages/Asistente'
import Layout from './components/Layout'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #333', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        <p style={{ color: '#666', marginTop: 16 }}>Cargando PitBox...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        {/* Landing pública — solo para no autenticados */}
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/home" />} />

        {/* Login / Registro */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />

        {/* App autenticada */}
        {user ? (
          <Route path="/" element={<Layout user={user} />}>
            <Route path="home" element={<Home user={user} />} />
            <Route path="garage" element={<MiGarage user={user} />} />
            <Route path="asistente" element={<Asistente user={user} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
