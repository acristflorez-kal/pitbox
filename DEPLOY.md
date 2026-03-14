# 🚀 Cómo publicar PitBox con dominio propio

## Paso 1 — Sube el código a GitHub

1. Ve a [github.com](https://github.com) → **New repository** → Nombre: `pitbox`
2. En tu terminal, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "PitBox inicial"
git remote add origin https://github.com/TU_USUARIO/pitbox.git
git push -u origin main
```

---

## Paso 2 — Despliega en Vercel (gratis)

1. Ve a [vercel.com](https://vercel.com) → **Sign Up** con tu cuenta de GitHub
2. Clic en **Add New Project** → importa el repo `pitbox`
3. Vercel lo detecta como proyecto Vite automáticamente ✅
4. Antes de hacer clic en **Deploy**, ve a **Environment Variables** y agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | Tu URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Tu anon key de Supabase |
| `VITE_ANTHROPIC_API_KEY` | Tu API key de Anthropic |

5. Clic en **Deploy** — listo, en ~2 minutos tienes la app online en `pitbox-xxx.vercel.app`

---

## Paso 3 — Compra el dominio

### Opciones recomendadas (de mejor a peor):

| Dominio | Precio/año | Dónde comprar |
|---------|-----------|---------------|
| `pitbox.app` | ~$14 | [namecheap.com](https://namecheap.com) |
| `pitbox.pe` | ~$30 | [nic.pe](https://nic.pe) — más local, más credibilidad |
| `mipitbox.com` | ~$10 | [namecheap.com](https://namecheap.com) |
| `pitboxauto.com` | ~$10 | [namecheap.com](https://namecheap.com) |

> **Recomendación:** `pitbox.app` en Namecheap. Corto, moderno y se entiende que es una app.

---

## Paso 4 — Conecta el dominio a Vercel

1. En Vercel → tu proyecto → **Settings** → **Domains**
2. Escribe tu dominio (ej: `pitbox.app`) → **Add**
3. Vercel te dará dos registros DNS. En Namecheap:
   - Ve a **Domain List** → **Manage** → **Advanced DNS**
   - Agrega los registros que indica Vercel (tipo A y CNAME)
4. En ~10 minutos el dominio apunta a tu app ✅
5. Vercel activa HTTPS automáticamente 🔒

---

## Paso 5 — Actualiza las URLs en el código

Una vez que tengas el dominio, busca `pitbox.app` en el código y reemplaza por tu dominio real si es diferente:

- `src/pages/Landing.jsx` — og:url y links
- `index.html` — meta og:url y twitter:url

---

## 🎯 Estrategia para viralizarlo

### Semana 1 — Lanzamiento

- [ ] Publica en **TikTok**: graba un video de 30 segundos mostrando cómo agregar un auto y recibir una alerta. Texto: *"Esta app me salvó de quedarme sin frenos 😱"*
- [ ] Comparte en grupos de **Facebook de autos en Perú** (hay miles: "Autos Peru", "Compra y Venta de Autos Lima", etc.)
- [ ] Publica en **Reddit r/PERU** con el título: *"Hice una app gratis para el mantenimiento de tu auto, con IA incluida"*
- [ ] Comparte en grupos de **WhatsApp** de conocidos que tengan auto

### Semana 2 — Crecimiento

- [ ] Crea una cuenta de **Instagram** @pitbox.app — posts con tips de mantenimiento de autos
- [ ] Contacta a **influencers de autos** en Perú (busca en Instagram: #autosPeru) — ofréceles una cuenta premium a futuro
- [ ] Escribe un post en **LinkedIn**: *"Construí una app de mantenimiento de autos con IA en X semanas"*

### Mecánica viral integrada

La app ya tiene el botón **"Comparte PitBox con amigos"** en la pantalla de inicio, que abre WhatsApp con un mensaje pre-escrito. Cada usuario satisfecho puede invitar fácilmente a otros.

---

## ⚠️ Importante antes de publicar

Asegúrate de tener configuradas las variables de entorno en Vercel. La API key de Anthropic se usa en el cliente (browser), lo cual es funcional pero expone la key. Para producción considera crear un backend proxy (Vercel Edge Functions) que haga las llamadas a la API de Anthropic.
