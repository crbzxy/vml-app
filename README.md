# vml-app

[![Netlify Status](https://api.netlify.com/api/v1/badges/b443cce8-f1a5-4490-86d3-5c913894735e/deploy-status)](https://app.netlify.com/sites/vortexmedialab/deploys)

Landing one-page de **Vortex Media Lab** — agencia de creatividad (Diseño · Audiovisual ·
Fotografía · Eventos) en CDMX. Bilingüe **ES/EN**, estilo cinematográfico oscuro.

## Stack

**React 18 + Vite.** SPA estática (sin SSR, no hace falta para una landing de una sola
página): build rápido, cero backend propio, deploy directo a Netlify.

- Sin librería de UI ni Tailwind: el CSS es el mismo sistema de diseño hecho a mano del
  avance original (`src/styles/styles.css`), portado casi literal para no perder fidelidad
  visual (colores de marca, tipografía N27, animaciones).
- i18n propio y minimalista (`src/i18n`), sin `react-i18next`: son ~200 llaves fijas en dos
  diccionarios, no justifica la dependencia.
- Envío del formulario de contacto vía **Netlify Forms** (ver abajo) — sin backend, sin
  API keys.

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # genera dist/
npm run preview     # sirve dist/ localmente
```

## Estructura

```
vml-app/
├── index.html                 ← plantilla; incluye el <form> oculto que Netlify detecta
├── src/
│   ├── App.jsx                 ← compone la página completa
│   ├── main.jsx
│   ├── components/              ← una sección = un componente (Hero, Work, Contact, ...)
│   ├── hooks/
│   │   ├── useMediaFlags.js     ← prefers-reduced-motion / touch
│   │   └── useVmlEffects.js     ← cursor, magnetismo, spotlight, reveal-on-scroll, parallax
│   ├── i18n/
│   │   ├── dictionary.js        ← todos los textos ES/EN
│   │   └── I18nContext.jsx
│   └── styles/styles.css        ← sistema de diseño completo (variables de marca al inicio)
└── public/assets/               ← imágenes, video del hero, logos de clientes, fuentes N27
```

## Formulario de contacto (Netlify Forms)

Se eligió **Netlify Forms** porque el único hosting disponible es Netlify: no requiere
backend propio, API key, ni cuenta en un proveedor de correo (Resend, SendGrid, etc.).
Netlify detecta el formulario en el HTML generado por el build (`dist/index.html`) y
gestiona el envío y el spam automáticamente.

Cómo funciona en este proyecto:

- `index.html` (raíz) tiene una **réplica estática oculta** del formulario
  (`<form name="contact" data-netlify="true" hidden>`). Es la que Netlify necesita ver en
  el HTML del build para habilitar el formulario — **no borrarla**, aunque nunca se
  muestre al usuario.
- El formulario real lo renderiza React en `src/components/Contact.jsx` y se envía por
  `fetch` a `/` como `application/x-www-form-urlencoded`, igual que lo haría un `<form>`
  nativo.
- Incluye honeypot (`bot-field`) para filtrar spam automáticamente.
- **En `npm run dev` el envío siempre falla** (verás "No se pudo enviar…") porque Netlify
  Forms solo existe en la infraestructura de Netlify — es esperado, no es un bug. Para
  probar el envío real hay que desplegar a Netlify.

### Pendiente en el dashboard de Netlify (una sola vez)

Netlify Forms no manda copia al visitante ni tiene plantilla propia; solo notifica al
dueño del sitio. Para que las dos personas de la agencia reciban los leads:

1. Netlify → tu sitio → **Site configuration → Forms → Form notifications**.
2. **Add notification → Email notification** → `carofernandez@vortexmedialab.mx`.
3. Repetir el paso 2 con `luisfernandez@vortexmedialab.mx` (una notificación por correo).
4. (Opcional) revisar **Forms → Spam filtering** — el honeypot ya está activo, pero ahí
   se puede sumar reCAPTCHA si empieza a llegar spam real.

## Deploy en Netlify

Sitio nuevo o ya conectado al repo:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- La config ya está en `netlify.toml`, así que un despliegue nuevo la toma automáticamente.

## Pendientes de contenido (heredados del avance de diseño)

- [ ] Enlaces reales de redes sociales en el footer/contacto (están en `href="#"`).
- [ ] `public/assets/img/og-cover.jpg` (1200×630) para la vista previa al compartir en
      redes — falta el archivo, el `<meta property="og:image">` ya apunta ahí.
- [ ] Carruseles de portafolio pendientes de imágenes: `pulso`, `salvora`, `cobalto`
      (ver `REELS` en `src/components/Work.jsx`; lista vacía = el tile usa su imagen
      estática, sin carrusel al hover).
- [ ] Los nombres de proyecto `Pulso — Festival`, `Sálvora — Packaging`,
      `Cobalto — Spot` son placeholders (`src/i18n/dictionary.js`, claves `work.p3`,
      `work.p4`, `work.p6`).
