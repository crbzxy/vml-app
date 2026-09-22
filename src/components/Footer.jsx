import { useI18n } from "../i18n/I18nContext";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src="/assets/img/logo-tagline.svg" alt="Vortex Media Lab" width="198" height="64" />
          <p>{t("footer.tag")}</p>
        </div>
        <div className="footer__meta">
          <span>© {year} Vortex Media Lab</span>
          <a href="#hero">{t("footer.top")}</a>
        </div>
      </div>
    </footer>
  );
}
