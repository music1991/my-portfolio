import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Calendar, DollarSign, Briefcase, Building2
} from "lucide-react";
import { useLanguage } from "../context/Language";
import { mailTo, PORTFOLIO_CONTACT_EMAIL } from "../components/Mail";

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

  const fieldClass =
    "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";
  const labelClass = "text-sm text-muted-foreground flex items-center gap-2";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--color-accent) / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-accent) / 0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="font-mono text-xs tracking-[0.16em] text-accent mb-4">
                {t("contact.kicker")}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading">
                {t("contact.hero.title")}
              </h1>
              <p className="mt-4 text-lg text-foreground/60 leading-relaxed max-w-xl">
                {t("contact.hero.subtitle")}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5 text-xs font-mono">
                <span className="px-3 py-1.5 border border-accent/40 bg-accent/10 text-accent">{t("contact.hero.tags.frontend")}</span>
                <span className="px-3 py-1.5 border border-accent/40 bg-accent/10 text-accent">{t("contact.hero.tags.ui")}</span>
                <span className="px-3 py-1.5 border border-accent/40 bg-accent/10 text-accent">{t("contact.hero.tags.scalable")}</span>
              </div>

              <div className="mt-12">
                <h2 className="text-lg font-semibold text-foreground">{t("contact.left.title")}</h2>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-foreground/70">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-accent flex-shrink-0" />
                    {t("contact.left.points.value")}
                  </li>
                  <li className="flex items-start gap-3 text-foreground/70">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-accent flex-shrink-0" />
                    {t("contact.left.points.comms")}
                  </li>
                </ul>
              </div>

              <div className="mt-8 space-y-2 font-mono text-sm">
                <a href={mailTo()} className="block text-accent hover:text-accent/80 min-h-[44px] flex items-center">
                  {PORTFOLIO_CONTACT_EMAIL}
                </a>
                <a href="tel:+5493815606434" className="flex items-center gap-2 min-h-[44px] text-muted-foreground hover:text-accent">
                  <Phone className="w-4 h-4" /> {t("contact.left.actions.phone")}
                </a>
              </div>
            </div>

            <div className="border border-accent/40 bg-card rounded-lg p-6 md:p-8">
              <h2 className="text-xl font-semibold text-card-foreground">{t("contact.form.title")}</h2>
              <p className="text-muted-foreground mt-1">{t("contact.form.subtitle")}</p>

              <form onSubmit={handleSubmit} className="mt-6" noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>{t("contact.form.labels.name")} *</label>
                    <input
                      id="contact-name"
                      ref={nameInputRef}
                      required
                      value={form.name}
                      onChange={onChange("name")}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                      className={fieldClass}
                      placeholder={t("contact.form.placeholders.name")}
                    />
                    {fieldErrors.name && (
                      <p id="contact-name-error" role="alert" className="mt-1 text-sm text-destructive">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>{t("contact.form.labels.email")} *</label>
                    <input
                      id="contact-email"
                      ref={emailInputRef}
                      required
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                      className={fieldClass}
                      placeholder={t("contact.form.placeholders.email")}
                    />
                    {fieldErrors.email && (
                      <p id="contact-email-error" role="alert" className="mt-1 text-sm text-destructive">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>
                      <Building2 className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.company")}
                    </label>
                    <input
                      id="contact-company"
                      value={form.company}
                      onChange={onChange("company")}
                      className={fieldClass}
                      placeholder={t("contact.form.placeholders.company")}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-project-type" className={labelClass}>
                      <Briefcase className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.projectType")}
                    </label>
                    <select
                      id="contact-project-type"
                      value={form.projectType}
                      onChange={onChange("projectType")}
                      className={fieldClass}
                    >
                      <option value="">{t("contact.form.selects.projectType.placeholder")}</option>
                      <option>{t("contact.form.selects.projectType.landing")}</option>
                      <option>{t("contact.form.selects.projectType.dashboard")}</option>
                      <option>{t("contact.form.selects.projectType.mobile")}</option>
                      <option>{t("contact.form.selects.projectType.optimize")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-budget" className={labelClass}>
                      <DollarSign className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.budget")}
                    </label>
                    <select
                      id="contact-budget"
                      value={form.budget}
                      onChange={onChange("budget")}
                      className={fieldClass}
                    >
                      <option value="">{t("contact.form.selects.budget.placeholder")}</option>
                      <option>{t("contact.form.selects.budget.b1")}</option>
                      <option>{t("contact.form.selects.budget.b2")}</option>
                      <option>{t("contact.form.selects.budget.b3")}</option>
                      <option>{t("contact.form.selects.budget.b4")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-timeline" className={labelClass}>
                      <Calendar className="w-4 h-4 text-muted-foreground" /> {t("contact.form.labels.timeline")}
                    </label>
                    <select
                      id="contact-timeline"
                      value={form.timeline}
                      onChange={onChange("timeline")}
                      className={fieldClass}
                    >
                      <option value="">{t("contact.form.selects.timeline.placeholder")}</option>
                      <option>{t("contact.form.selects.timeline.asap")}</option>
                      <option>{t("contact.form.selects.timeline.t1")}</option>
                      <option>{t("contact.form.selects.timeline.t2")}</option>
                      <option>{t("contact.form.selects.timeline.flex")}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contact-message" className={labelClass}>{t("contact.form.labels.message")} *</label>
                    <textarea
                      id="contact-message"
                      ref={messageInputRef}
                      required
                      value={form.message}
                      onChange={onChange("message")}
                      rows={5}
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                      className={fieldClass}
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

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[44px] px-6 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:bg-accent/90 active:bg-accent/80 transition disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {loading ? t("contact.form.actions.sending") : t("contact.form.actions.send")}
                    {!loading && <span aria-hidden="true">→</span>}
                  </button>
                  {error && (
                    <p role="alert" className="mt-2 text-sm text-destructive text-center">
                      {error}
                    </p>
                  )}
                </div>

                {submitted && (
                  <div role="status" aria-live="polite" className="mt-4 text-sm text-accent bg-accent/10 border border-accent/20 rounded-md px-3 py-2">
                    {t("contact.form.feedback.success")}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
