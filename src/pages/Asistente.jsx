import { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'
import { Send, Bot, User, Car } from 'lucide-react'

const Asistente = ({ user }) => {
  const [mensajes, setMensajes] = useState([
    {
      rol: 'asistente',
      texto: '¡Hola! Soy el asistente mecánico de PitBox 🏎️\n\nPuedo ayudarte con:\n• Consultas sobre mantenimiento de tu vehículo\n• Consejos sobre cables automotrices\n• Diagnóstico de problemas mecánicos\n\n¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehiculos, setVehiculos] = useState([])
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [mantenimientos, setMantenimientos] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => { cargarVehiculos() }, [])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensajes])

  useEffect(() => {
    if (vehiculoSeleccionado) {
      cargarMantenimientos(vehiculoSeleccionado.id)
    } else {
      setMantenimientos([])
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

  const enviarMensaje = async () => {
    if (!input.trim() || loading) return
    const pregunta = input.trim()
    setInput('')
    setMensajes(prev => [...prev, { rol: 'usuario', texto: pregunta }])
    setLoading(true)

    try {
      const contextoVehiculo = vehiculoSeleccionado
        ? `El usuario tiene un ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} ${vehiculoSeleccionado.año} con combustible ${vehiculoSeleccionado.combustible}${vehiculoSeleccionado.placa ? `, placa ${vehiculoSeleccionado.placa}` : ''}.`
        : 'El usuario no ha seleccionado un vehículo específico.'

      const contextoMantenimientos = mantenimientos.length > 0
        ? `\n\nHistorial de mantenimiento registrado:\n${mantenimientos.map(m =>
            `- ${m.tipo}${m.fecha_realizado ? `, realizado el ${m.fecha_realizado}` : ''}${m.kilometraje ? `, a ${m.kilometraje} km` : ''}${m.proxima_fecha ? `, próximo mantenimiento: ${m.proxima_fecha}` : ''}${m.notas ? `, notas: ${m.notas}` : ''}`
          ).join('\n')}`
        : '\n\nEl usuario no tiene mantenimientos registrados para este vehículo.'

      const historial = mensajes.slice(-6).map(m => ({
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
          max_tokens: 1000,
          system: `Eres el asistente mecánico de PitBox, una plataforma inteligente para dueños de vehículos en Perú.

Contexto del usuario: ${contextoVehiculo}${contextoMantenimientos}

Tu especialidad es:
- Cables automotrices (freno, acelerador, embrague, velocímetro)
- Mantenimiento preventivo de vehículos
- Diagnóstico de problemas mecánicos comunes
- Recomendaciones de repuestos

Usa el historial de mantenimiento del usuario para dar respuestas personalizadas y precisas. Si tiene fecha de próximo mantenimiento registrada, úsala. Siempre responde en español, de forma amigable y práctica. Sé conciso pero completo.`,
          messages: [...historial, { role: 'user', content: pregunta }]
        })
      })

      const data = await response.json()
      const respuesta = data.content?.[0]?.text || 'Lo siento, no pude procesar tu consulta.'
      setMensajes(prev => [...prev, { rol: 'asistente', texto: respuesta }])
    } catch (e) {
      setMensajes(prev => [...prev, { rol: 'asistente', texto: 'Error al conectar con el asistente. Intenta nuevamente.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', color: 'white' }}>

      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px 0' }}>Asistente Mecánico 🔧</h1>

        {/* Selector de vehículo */}
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
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Bot size={16} style={{ color: 'white' }} />
              </div>
            )}
            <div style={{
              maxWidth: '80%', padding: '10px 14px', borderRadius: m.rol === 'usuario' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
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
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          placeholder="Escribe tu consulta mecánica..."
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
