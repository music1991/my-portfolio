/** Datos de contacto fijos del portfolio (no hay dashboard para cargarlos). */
export const CONTACT_EMAIL = "sebastians201991@gmail.com";

/**
 * Link de "Horario de reservas" de Google Calendar (https://calendar.app.google/xxxx).
 * Se genera en Google Calendar → Crear → Horario de citas. Si se completa, el botón
 * "Agendar reunión" lo abre embebido en un modal; si queda vacío, abre en una pestaña
 * nueva un evento de Google Calendar con CONTACT_EMAIL ya invitado.
 */
// Link corto: https://calendar.app.google/QUQQmsvVZbetcbKN9 — no se puede usar en iframe
// (Google responde X-Frame-Options: SAMEORIGIN). Se usa la URL de embed (?gv=true) de la misma agenda.
export const GOOGLE_CALENDAR_BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3UUJw_Xau1brKBUteG1Zd-nt3EtWVWCxq2RYr-omGJcqsdca2PC4vs8uh1yh-9gyRXUbIF5Ci1?gv=true";

/** Query param que abre el modal de agenda al entrar: https://<dominio>/?agendar */
export const SCHEDULE_QUERY_PARAM = "agendar";

export const isSafeHttpUrl = (url: string) => {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};

/** Fallback sin link de reservas: plantilla de evento con el email como invitado. */
export const buildCalendarInviteUrl = (title: string) =>
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&add=${encodeURIComponent(CONTACT_EMAIL)}`;
