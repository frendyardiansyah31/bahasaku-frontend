import { useTranslation } from "react-i18next";
import styles from "../styles/LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "id" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      className={styles.switcherBtn}
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={
        i18n.language === "en" ? "Switch to Indonesian" : "Switch to English"
      }
    >
      <i className="bi bi-globe"></i>
      <span className={styles.langText}>
        {i18n.language === "en" ? "EN" : "ID"}
      </span>
    </button>
  );
}
