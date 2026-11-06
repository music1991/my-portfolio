import { useLanguage } from "../context/Language";
import { CONTACT_EMAIL } from "../entities/lib/constants";

export const PORTFOLIO_CONTACT_EMAIL = CONTACT_EMAIL;

export const mailTo = () => {
  const { t } = useLanguage();

  return `mailto:${PORTFOLIO_CONTACT_EMAIL}?subject=${encodeURIComponent(
    t("contact.mailto.subjectPrefix") + " - " + (t("contact.form.placeholders.projectTypeFallback"))
  )}&body=${encodeURIComponent(
    t("contact.mailto.template")
  )}`;
};