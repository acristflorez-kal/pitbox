import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Home, Car, MessageCircle, LogOut, ShoppingBag, Store } from 'lucide-react'

const Layout = ({ user }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/home', icon: Home, label: 'Inicio' },
    { path: '/tienda', icon: ShoppingBag, label: 'Tienda' },
    { path: '/asistente', icon: MessageCircle, label: 'Asistente' },
    { path: '/garage', icon: Car, label: 'Garage' },
    { path: '/repuestero', icon: Store, label: 'Vender' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: '#111', borderBottom: '1px solid #222', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 16 }}>P</div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>PitBox</span>
        </div>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'transparent', border: '1px solid #333', borderRadius: 8, color: '#666', cursor: 'pointer', fontSize: 13 }}>
          <LogOut size={14} />
          Salir
        </button>
      </header>

      {/* Contenido */}
      <main style={{ flex: 1, padding: '20px 16px', maxWidth: 680, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav style={{ background: '#111', borderTop: '1px solid #222', display: 'flex', position: 'sticky', bottom: 0, zIndex: 10 }}>
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '10px 0', textDecoration: 'none', gap: 4,
            color: isActive(path) ? '#ef4444' : '#555',
            borderTop: isActive(path) ? '2px solid #ef4444' : '2px solid transparent'
          }}>
            <Icon size={22} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Layout
