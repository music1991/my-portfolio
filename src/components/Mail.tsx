import { useLanguage } from "../context/Language";

export const PORTFOLIO_CONTACT_EMAIL = "sebastians201991@gmail.com";

export const mailTo = () => {
  const { t } = useLanguage();

  return `mailto:${PORTFOLIO_CONTACT_EMAIL}?subject=${encodeURIComponent(
    t("contact.mailto.subjectPrefix") + " - " + (t("contact.form.placeholders.projectTypeFallback"))
  )}&body=${encodeURIComponent(
    t("contact.mailto.template")
  )}`;
};