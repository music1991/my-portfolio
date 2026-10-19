const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: true }));
app.use(express.json());

// ===== API de contacto =====

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.RESEND_API_KEY),
    from: process.env.EMAIL_FROM || null,
    to: process.env.TO_EMAIL || null,
  });
});

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, company, projectType, budget, timeline } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Campos requeridos' });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.TO_EMAIL,
      subject: `Porfolio | Nuevo mensaje: ${name}`,
      reply_to: email,
      html: `
        <div style="font-family:system-ui;line-height:1.5">
          <h2>Nuevo mensaje desde el Porfolio</h2>
          <p><b>Nombre:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          ${company ? `<p><b>Empresa:</b> ${company}</p>` : ''}
          ${projectType ? `<p><b>Tipo de proyecto:</b> ${projectType}</p>` : ''}
          ${budget ? `<p><b>Presupuesto:</b> ${budget}</p>` : ''}
          ${timeline ? `<p><b>Timeline:</b> ${timeline}</p>` : ''}
          <p><b>Mensaje:</b><br/>${String(message).replace(/\n/g,'<br/>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR =>', JSON.stringify(error, null, 2));
      return res.status(500).json({ ok: false, error: error.message || 'Resend error' });
    }

    return res.json({ ok: true, id: data?.id ?? null });
  } catch (e) {
    console.error('API ERROR =>', e);
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  }
});

// Cualquier otra ruta /api que no exista: 404 en JSON, nunca el HTML del sitio.
app.use('/api', (req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// ===== Sitio estático (build de Vite en ../dist) =====
// Reemplaza lo que hacía el .htaccess: en modo Node.js del panel, Apache no interviene.

const DIST = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error(`ATENCIÓN: no existe ${path.join(DIST, 'index.html')}. Corré "npm run build" en la raíz del proyecto.`);
}

const setCacheHeaders = (res, filePath) => {
  if (filePath.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else if (/[\\/]assets[\\/]/.test(filePath)) {
    // Archivos de Vite con hash en el nombre
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (/\.(webp|png|jpe?g|svg|mp4|woff2?|ico)$/i.test(filePath)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  }
};

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Páginas pre-renderizadas para SEO: /about -> about.html, /en -> en.html, /en/about -> en/about.html
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const urlPath = req.path.replace(/\/+$/, '');
  if (!urlPath) return next(); // "/" lo sirve express.static con index.html
  const file = path.join(DIST, urlPath + '.html');
  if (!file.startsWith(DIST + path.sep) || !fs.existsSync(file)) return next();
  setCacheHeaders(res, file);
  return res.sendFile(file);
});

// Archivos reales (assets, imágenes, robots.txt, sitemap.xml, index.html en "/").
// redirect:false evita que /en redirija a /en/ por existir la carpeta dist/en.
app.use(express.static(DIST, { redirect: false, setHeaders: setCacheHeaders }));

// Fallback SPA: rutas sin extensión van a index.html; un archivo inexistente (.js, .png…) da 404.
app.use((req, res) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && !path.extname(req.path)) {
    const index = path.join(DIST, 'index.html');
    setCacheHeaders(res, index);
    return res.sendFile(index);
  }
  return res.status(404).send('Not found');
});

// El panel asigna el puerto (3847) en PORT; nginx se conecta por 127.0.0.1.
const PORT = process.env.PORT || 3847;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => console.log(`Sitio + API escuchando en http://${HOST}:${PORT}`));
