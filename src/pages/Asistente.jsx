import { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'
import { Send, Bot, User, Car, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Asistente = ({ user }) => {
  const navigate = useNavigate()
  const [mensajes, setMensajes] = useState([
    {
      rol: 'asistente',
      texto: '¡Hola! Soy el asistente de PitBox 🏎️\n\nPuedo ayudarte con:\n• Buscar repuestos para tu vehículo y comparar precios\n• Consultas de mantenimiento y diagnóstico\n• Ver tu historial de compras\n• Recomendarte cuándo cambiar cada pieza\n\n¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehiculos, setVehiculos] = useState([])
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [mantenimientos, setMantenimientos] = useState([])
  const [historialCompras, setHistorialCompras] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => { cargarVehiculos() }, [])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensajes])

  useEffect(() => {
    if (vehiculoSeleccionado) {
      cargarMantenimientos(vehiculoSeleccionado.id)
      cargarHistorialCompras(vehiculoSeleccionado.id)
    } else {
      setMantenimientos([])
      setHistorialCompras([])
    }
  }, [vehiculoSeleccionado])

  const cargarVehiculos = async () => {
    const { data } = await supabase.from('vehiculos').select('*').eq('usuario_id', user.id)
    setVehiculos(data || [])
  }

  const cargarMantenimientos = async (vehiculoId) => {
    const { data } = await supabase.from('mantenimientos').select('*').eq('vehiculo_id', vehiculoId).order('fecha_realizado', { ascending: false })
    setMantenimientos(data || [])
  }

  const cargarHistorialCompras = async (vehiculoId) => {
    const { data } = await supabase.from('historial_compras').select('*').eq('vehiculo_id', vehiculoId).order('fecha_compra', { ascending: false })
    setHistorialCompras(data || [])
  }

  const buscarProductosEnTienda = async (termino) => {
    const { data } = await supabase
      .from('productos')
      .select('*, repuesteros(nombre_tienda, distrito, ciudad, whatsapp)')
      .eq('activo', true)
      .or(`nombre.ilike.%${termino}%,compatible_marcas.ilike.%${termino}%,compatible_modelos.ilike.%${termino}%,categoria.ilike.%${termino}%`)
      .limit(5)
    return data || []
  }

  const enviarMensaje = async () => {
    if (!input.trim() || loading) return
    const pregunta = input.trim()
    setInput('')
    setMensajes(prev => [...prev, { rol: 'usuario', texto: pregunta }])
    setLoading(true)

    try {
      // Buscar productos relevantes en la tienda
      const palabrasClave = pregunta.toLowerCase().replace(/[¿?¡!]/g, '').split(' ').filter(p => p.length > 3)
      let productosEncontrados = []
      for (const palabra of palabrasClave.slice(0, 3)) {
        const prods = await buscarProductosEnTienda(palabra)
        productosEncontrados = [...productosEncontrados, ...prods]
      }
      // Eliminar duplicados
      const idsVistos = new Set()
      productosEncontrados = productosEncontrados.filter(p => {
        if (idsVistos.has(p.id)) return false
        idsVistos.add(p.id)
        return true
      }).slice(0, 4)

      const contextoVehiculo = vehiculoSeleccionado
        ? `Vehículo del usuario: ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} ${vehiculoSeleccionado.año}, combustible ${vehiculoSeleccionado.combustible}${vehiculoSeleccionado.placa ? `, placa ${vehiculoSeleccionado.placa}` : ''}.`
        : 'El usuario no ha seleccionado un vehículo específico.'

      const contextoMantenimientos = mantenimientos.length > 0
        ? `\n\nHistorial de mantenimiento del vehículo:\n${mantenimientos.slice(0, 5).map(m =>
            `- ${m.tipo}${m.fecha_realizado ? `, realizado el ${m.fecha_realizado}` : ''}${m.kilometraje ? `, a ${m.kilometraje} km` : ''}${m.proxima_fecha ? `, próximo: ${m.proxima_fecha}` : ''}${m.costo ? `, costo: S/ ${m.costo}` : ''}`
          ).join('\n')}`
        : '\n\nSin historial de mantenimiento registrado para este vehículo.'

      const contextoCompras = historialCompras.length > 0
        ? `\n\nHistorial de compras de repuestos del vehículo:\n${historialCompras.slice(0, 5).map(c =>
            `- ${c.producto}${c.fecha_compra ? `, comprado el ${c.fecha_compra}` : ''}${c.tienda ? `, en ${c.tienda}` : ''}${c.precio ? `, S/ ${c.precio}` : ''}${c.proximo_cambio ? `, próximo cambio: ${c.proximo_cambio}` : ''}`
          ).join('\n')}`
        : ''

      const contextoProductos = productosEncontrados.length > 0
        ? `\n\nProductos disponibles en la tienda PitBox relacionados con la consulta:\n${productosEncontrados.map(p =>
            `- "${p.nombre}" ${p.marca ? `(${p.marca})` : ''} — S/ ${p.precio_oferta || p.precio}${p.precio_oferta ? ` (oferta, antes S/ ${p.precio})` : ''}${p.es_remate ? ' 🔥 REMATE' : ''} — Tienda: ${p.repuesteros?.nombre_tienda || 'N/A'}, ${p.repuesteros?.distrito || ''} — WhatsApp: ${p.repuesteros?.whatsapp || 'N/A'} — Compatible: ${p.compatible_marcas || 'varios'}`
          ).join('\n')}\n\nSi el usuario pregunta por repuestos, menciona estos productos con sus precios y tiendas.`
        : ''

      const historialChat = mensajes.slice(-6).map(m => ({
        role: m.rol === 'usuario' ? 'user' : 'assistant',
        content: m.texto
      }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `Eres el asistente inteligente de PitBox, el marketplace automotriz de Perú. Trabajas para Verit, empresa especialista en cables automotrices.

${contextoVehiculo}${contextoMantenimientos}${contextoCompras}${contextoProductos}

Tu personalidad: amigable, directo, útil. Siempre hablas en español peruano natural.

Tus capacidades:
1. REPUESTOS: Si el usuario necesita un repuesto, busca en los productos disponibles arriba y muéstrale opciones con precio, tienda y ubicación. Siempre menciona si hay remates o descuentos. Recomienda Verit para cables automotrices.
2. HISTORIAL: Puedes consultar el historial de compras y mantenimientos del vehículo. Si el usuario pregunta "¿cuándo cambié mi cable?" o similar, responde con la fecha exacta del historial.
3. RECORDATORIOS: Si detectas en el historial que algo está próximo a vencer, avísale.
4. DIAGNÓSTICO: Ayuda a diagnosticar problemas mecánicos basándote en los síntomas que describe.
5. ÓRDENES: Si el usuario quiere comprar algo, dile que puede ir a la pestaña "Tienda" para hacer el pedido, o contactar directo por WhatsApp al número del repuestero.

IMPORTANTE: Si hay productos en la tienda PitBox que coinciden con la consulta, siempre muéstralos con precio y datos de contacto. Compara precios si hay varios. Sé el mejor vendedor y asesor que el dueño del auto puede tener.`,
          messages: [...historialChat, { role: 'user', content: pregunta }]
        })
      })

      const data = await response.json()
      const respuesta = data.content?.[0]?.text || 'Lo siento, no pude procesar tu consulta.'
      setMensajes(prev => [...prev, { rol: 'asistente', texto: respuesta }])
    } catch (e) {
      setMensajes(prev => [...prev, { rol: 'asistente', texto: 'Error al conectar. Verifica tu conexión e intenta nuevamente.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', color: 'white' }}>

      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Asistente 🔧</h1>
          <button onClick={() => navigate('/tienda')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#ef444420', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <ShoppingBag size={12} /> Ver tienda
          </button>
        </div>

        {vehiculos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <button onClick={() => setVehiculoSeleccionado(null)}
              style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 99, border: `1px solid ${!vehiculoSeleccionado ? '#ef4444' : '#333'}`, background: !vehiculoSeleccionado ? '#2a0000' : 'transparent', color: !vehiculoSeleccionado ? '#ef4444' : '#666', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              General
            </button>
            {vehiculos.map(v => (
              <button key={v.id} onClick={() => setVehiculoSeleccionado(v)}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, border: `1px solid ${vehiculoSeleccionado?.id === v.id ? '#ef4444' : '#333'}`, background: vehiculoSeleccionado?.id === v.id ? '#2a0000' : 'transparent', color: vehiculoSeleccionado?.id === v.id ? '#ef4444' : '#666', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                <Car size={12} />{v.marca} {v.modelo}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
        {mensajes.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.rol === 'usuario' ? 'flex-end' : 'flex-start' }}>
            {m.rol === 'asistente' && (
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Bot size={16} style={{ color: 'white' }} />
              </div>
            )}
            <div style={{
              maxWidth: '80%', padding: '10px 14px',
              borderRadius: m.rol === 'usuario' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.rol === 'usuario' ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#1a1a1a',
              border: m.rol === 'asistente' ? '1px solid #2a2a2a' : 'none',
              fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap'
            }}>
              {m.texto}
            </div>
            {m.rol === 'usuario' && (
              <div style={{ width: 32, height: 32, background: '#333', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <User size={16} style={{ color: '#aaa' }} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} style={{ color: 'white' }} />
            </div>
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', animation: `bounce 1s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid #222', marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviarMensaje()}
          placeholder="¿Qué repuesto necesitas? ¿Qué le pasa a tu auto?"
          style={{ flex: 1, padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, color: 'white', fontSize: 14, outline: 'none' }} />
        <button onClick={enviarMensaje} disabled={loading || !input.trim()}
          style={{ width: 46, height: 46, background: input.trim() ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#222', border: 'none', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
          <Send size={18} style={{ color: input.trim() ? 'white' : '#555' }} />
        </button>
      </div>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
      `}</style>
    </div>
  )
}

export default Asistente
