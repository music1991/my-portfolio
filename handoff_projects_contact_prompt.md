# Prompt: Proyectos (tilt 3D) + Contacto (hero oscuro Signal Grid)

Pegá esto en Claude Code (o aplicalo a mano) parado en la raíz de `my-portfolio`. Son cambios puramente de estilo/interacción, no toco la lógica de negocio (el formulario de contacto sigue llamando a `VITE_CONTACT_API` exactamente igual).

---

## 1. `src/sections/Projects.tsx` — tilt 3D en hover

Buscá el bloque del `<article>` dentro del `.map(...)` y reemplazalo por este (agrega `onMouseMove`/`onMouseLeave` para inclinar la card en 3D; sale el `hover:scale-110` porque ahora la escala/inclinación las maneja el transform inline):

```tsx
          return (
            <article
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item, idx)}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                const rx = (py - 0.5) * -10;
                const ry = (px - 0.5) * 10;
                el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
              }}
              style={{ transformStyle: "preserve-3d", transition: "transform 150ms ease" }}
              className={`relative group rounded-2xl overflow-hidden ${scale} hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
            >
```

Todo lo demás del archivo (imports, `handleItemClick`, el `<img>` interno, `<ModalProject>`, etc.) queda igual.

## 2. `src/pages/Contact.tsx` — hero oscuro "Signal Grid"

Reemplazá SOLO el bloque de la sección hero (el primer `<section>` dentro del `return`, antes de `<section className="max-w-6xl mx-auto...">`). No toques nada del `<form>`, `validate()`, `handleSubmit`, estados, ni el `<aside>` con los datos de contacto — sigue igual.

Buscá esto:

```tsx
      <section className="py-36 md:py-40 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("contact.hero.title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl">
            {t("contact.hero.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25">{t("contact.hero.tags.frontend")}</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25">{t("contact.hero.tags.ui")}</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25">{t("contact.hero.tags.scalable")}</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-8 -mt-10 pb-20">
```

Y reemplazalo por:

```tsx
      <section className="relative py-32 md:py-36 bg-[#0b0b0d] text-white overflow-hidden border-b border-accent/20">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs tracking-[0.16em] text-accent mb-4 uppercase">
            // {t("contact.left.title")}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading">
            {t("contact.hero.title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl">
            {t("contact.hero.subtitle")}
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5 text-xs font-mono">
            <span className="px-3 py-1.5 border border-accent/40 bg-accent/10 text-accent">{t("contact.hero.tags.frontend")}</span>
            <span className="px-3 py-1.5 border border-accent/40 bg-accent/10 text-accent">{t("contact.hero.tags.ui")}</span>
            <span className="px-3 py-1.5 border border-accent/40 bg-accent/10 text-accent">{t("contact.hero.tags.scalable")}</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-14 pb-20">
```

### Qué cambia visualmente
- El fondo del hero pasa de un degradé `primary→accent` a negro fijo (`#0b0b0d`), igual que el hero de la home (Hero3D) — no depende del toggle claro/oscuro, siempre queda oscuro.
- Se agrega una grilla de puntos/líneas sutil de fondo (mismo patrón que usa la sección de Proyectos en el prototipo) y un kicker en monospace `// {título}`.
- Los tags pasan de píldoras redondeadas (`rounded-full`) a chips cuadrados con borde `accent/40` y fondo `accent/10`, en monospace — mismo lenguaje visual que el hero y los anillos de skills.
- Se quita el `-mt-10` (que hacía que el panel de abajo se superpusiera al hero con la card `rounded-2xl`) y se reemplaza por `pt-14`, ya que el nuevo hero no tiene el mismo overlap de color de fondo.
- El resto de la página (aside "¿Por qué trabajar conmigo?", el formulario completo con sus validaciones, estados de error/loading/success) queda pixel-igual y sigue respetando el tema claro/oscuro del sitio.

## 3. Verificar

- `npm run dev` → entrá a `/contact`: el hero debe verse negro con grilla de puntos sutil, chips cuadrados en azul, igual que el hero de home pero sin la escena 3D animada.
- El formulario debe seguir funcionando exactamente igual (mismos campos, misma validación, mismo `fetch` a `VITE_CONTACT_API`).
- En Proyectos, pasar el mouse sobre una card debe inclinarla en 3D (`rotateX`/`rotateY`) en vez de solo escalar.
- `npm run build` sin errores de TypeScript.
