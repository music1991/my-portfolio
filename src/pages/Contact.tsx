import React, { useEffect, useRef, useState } from "react";
import {
  Mail, Phone, ArrowUpRight,
  Calendar, DollarSign, Briefcase, Building2
} from "lucide-react";
import { useLanguage } from "../context/Language";
import { mailTo } from "../components/Mail";

type FormState = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  website?: string;
};

type ApiResp = { ok: boolean; id?: string | null; error?: string };

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  website: "",
};

const API_URL = import.meta.env.VITE_CONTACT_API;

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const onChange =
    (k: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((s) => ({ ...s, [k]: e.target.value }));
        if (k === "name" || k === "email" || k === "message") {
          setFieldErrors((s) => ({ ...s, [k]: undefined }));
        }
      };

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = t("contact.form.errors.required");
    if (!form.email.trim()) errors.email = t("contact.form.errors.required");
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = t("contact.form.errors.invalidEmail");
    if (!form.message.trim()) errors.message = t("contact.form.errors.required");
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    const errors = validate();
    setFieldErrors(errors);
    if (errors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (errors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (errors.message) {
      messageInputRef.current?.focus();
      return;
    }

    // honeypot
    if (form.website && form.website.trim().length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          projectType: form.projectType,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as ApiResp;
      if (!res.ok || json?.ok === false) throw new Error(json?.error || t("contact.form.errors.generic"));

      setSubmitted(true);
      setForm(initialState);
      setFieldErrors({});
    } catch (err: any) {
      setError(err?.message || t("contact.form.errors.network"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <main className="min-h-screen bg-background text-foreground">
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
        <div className="grid md:grid-cols-5 gap-8">
          <aside className="md:col-span-2">
            <div className="p-6 rounded-2xl bg-card shadow-sm border border-border">
              <h2 className="text-xl font-semibold text-card-foreground">{t("contact.left.title")}</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li className="flex gap-2"><Briefcase className="w-5 h-5 text-accent" /> {t("contact.left.points.value")}</li>
                <li className="flex gap-2"><Building2 className="w-5 h-5 text-accent" /> {t("contact.left.points.comms")}</li>
              </ul>

              <div className="mt-6 h-px bg-border" />

              <div className="mt-6 space-y-3">
                <a href={mailTo()} className="flex items-center gap-2 min-h-[44px] text-accent hover:text-primary">
                  <Mail className="w-5 h-5" /> {t("contact.left.actions.email")} <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href="tel:+5493815606434" className="flex items-center gap-2 min-h-[44px] text-accent hover:text-primary">
                  <Phone className="w-5 h-5" /> {t("contact.left.actions.phone")}
                </a>
              </div>
            </div>
          </aside>

          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-card shadow-sm border border-border" noValidate>
              <h2 className="text-xl font-semibold text-card-foreground">{t("contact.form.title")}</h2>
              <p className="text-muted-foreground mt-1">{t("contact.form.subtitle")}</p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label htmlFor="contact-name" className="text-sm text-muted-foreground">{t("contact.form.labels.name")} *</label>
                  <input
                    id="contact-name"
                    ref={nameInputRef}
                    required
                    value={form.name}
                    onChange={onChange("name")}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                    placeholder={t("contact.form.placeholders.name")}
                  />
                  {fieldErrors.name && (
                    <p id="contact-name-error" role="alert" className="mt-1 text-sm text-destructive">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm text-muted-foreground">{t("contact.form.labels.email")} *</label>
                  <input
                    id="contact-email"
                    ref={emailInputRef}
                    required
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                    placeholder={t("contact.form.placeholders.email")}
                  />
                  {fieldErrors.email && (
                    <p id="contact-email-error" role="alert" className="mt-1 text-sm text-destructive">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-company" className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.company")}
                  </label>
                  <input
                    id="contact-company"
                    value={form.company}
                    onChange={onChange("company")}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                    placeholder={t("contact.form.placeholders.company")}
                  />
                </div>
                <div>
                  <label htmlFor="contact-project-type" className="text-sm text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.projectType")}
                  </label>
                  <select
                    id="contact-project-type"
                    value={form.projectType}
                    onChange={onChange("projectType")}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                  >
                    <option value="">{t("contact.form.selects.projectType.placeholder")}</option>
                    <option>{t("contact.form.selects.projectType.landing")}</option>
                    <option>{t("contact.form.selects.projectType.dashboard")}</option>
                    <option>{t("contact.form.selects.projectType.mobile")}</option>
                    <option>{t("contact.form.selects.projectType.optimize")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-budget" className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.budget")}
                  </label>
                  <select
                    id="contact-budget"
                    value={form.budget}
                    onChange={onChange("budget")}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                  >
                    <option value="">{t("contact.form.selects.budget.placeholder")}</option>
                    <option>{t("contact.form.selects.budget.b1")}</option>
                    <option>{t("contact.form.selects.budget.b2")}</option>
                    <option>{t("contact.form.selects.budget.b3")}</option>
                    <option>{t("contact.form.selects.budget.b4")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-timeline" className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.timeline")}
                  </label>
                  <select
                    id="contact-timeline"
                    value={form.timeline}
                    onChange={onChange("timeline")}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                  >
                    <option value="">{t("contact.form.selects.timeline.placeholder")}</option>
                    <option>{t("contact.form.selects.timeline.asap")}</option>
                    <option>{t("contact.form.selects.timeline.t1")}</option>
                    <option>{t("contact.form.selects.timeline.t2")}</option>
                    <option>{t("contact.form.selects.timeline.flex")}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="contact-message" className="text-sm text-muted-foreground">{t("contact.form.labels.message")} *</label>
                  <textarea
                    id="contact-message"
                    ref={messageInputRef}
                    required
                    value={form.message}
                    onChange={onChange("message")}
                    rows={5}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground"
                    placeholder={t("contact.form.placeholders.message")}
                  />
                  {fieldErrors.message && (
                    <p id="contact-message-error" role="alert" className="mt-1 text-sm text-destructive">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">{t("contact.form.labels.website")}</label>
                  <input
                    id="contact-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={onChange("website")}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-64 min-h-[44px] px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 active:bg-accent/80 transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? t("contact.form.actions.sending") : t("contact.form.actions.send")}
                </button>
                {error && (
                  <span role="alert" className="text-sm text-destructive">
                    {error}
                  </span>
                )}
              </div>

              {submitted && (
                <div role="status" aria-live="polite" className="mt-4 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
                  {t("contact.form.feedback.success")}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
