# Personal Portfolio

Personal portfolio website built with **React, TypeScript, and Vite**.  
This project presents my professional profile, experience, education, and interests in a clean and structured format.

It is intended as a technical and professional introduction for recruiters, collaborators, and development teams.

---

## Features

- Personal and professional project showcase  
- Work experience from previous companies  
- Education and academic background  
- Hobbies and personal interests  
- Contact and LinkedIn integration  
- Modern, fast, and maintainable frontend setup  

---

## Tech Stack

- React  
- TypeScript  
- Vite  
- Modern CSS / styling solutions  
- ESLint for code quality  

---

## Project Structure

The portfolio is organized into clear sections to ensure readability and easy navigation:

- **About** – Professional overview and background  
- **Projects** – Personal and professional work  
- **Education** – Academic background and training  
- **Hobbies & Interests** – Personal interests outside of work  
- **Contact** – Ways to get in touch  

---

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn

### Installation

```bash
npm install
```

## Producción en VPS con Nginx

El sitio se compila como archivos estáticos, con una página HTML pre-renderizada
para cada ruta e idioma para que los buscadores reciban sus metadatos SEO sin
ejecutar JavaScript.

1. Ejecutá `npm run build` y publicá el **contenido** de `dist/` en el directorio
   raíz configurado para el dominio.
2. El administrador del VPS debe configurar Nginx para servir esos archivos
   directamente, no reenviar todas las solicitudes a un proceso Node. El
   fragmento [deploy/nginx-site.locations.conf](./deploy/nginx-site.locations.conf)
   debe incluirse dentro del `server` HTTPS existente. Conservá el bloque TLS
   actual y configurá `root` para que apunte al directorio publicado.
3. El fragmento sirve las rutas pre-renderizadas (`/`, `/about`, `/contact`,
   `/en`, `/en/about` y `/en/contact`) y usa `index.html` como fallback. La API
   del formulario se limita a `/api/` y se reenvía a `127.0.0.1:8787`.
4. El servidor Node de `server/server.cjs` debe estar en ejecución en el puerto
   `8787` y tener configuradas sus variables `RESEND_API_KEY`, `EMAIL_FROM` y
   `TO_EMAIL`. Si la API se aloja en otra URL, definí `VITE_CONTACT_API` al
   compilar el frontend.
5. Antes de aplicar la configuración, el administrador debe validar Nginx con
   `nginx -t` y recargarlo usando el procedimiento del VPS.

No reemplaces toda la configuración del dominio por el fragmento: debe
integrarse en el `server` HTTPS existente para conservar los certificados y
ajustes TLS.