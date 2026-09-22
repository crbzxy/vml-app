import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import VortexMark from "./icons/VortexMark";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function encodeForNetlify(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");
}

const INITIAL = { name: "", email: "", type: "design", message: "", "bot-field": "" };

export default function Contact() {
  const { t } = useI18n();
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | ok | invalid | networkError

  const onChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: false }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      name: !fields.name.trim(),
      email: !EMAIL_RE.test(fields.email.trim()),
      message: !fields.message.trim(),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForNetlify({ "form-name": "contact", ...fields }),
      });
      if (!res.ok) throw new Error(`Netlify Forms respondió ${res.status}`);
      setStatus("ok");
      setFields(INITIAL);
    } catch {
      setStatus("networkError");
    }
  };

  const statusText =
    status === "sending"
      ? t("form.sending")
      : status === "ok"
      ? t("form.ok")
      : status === "invalid"
      ? t("form.err")
      : status === "networkError"
      ? t("form.errNetwork")
      : "";

  return (
    <section className="contact" id="contact">
      <VortexMark className="contact__watermark" />
      <div className="container contact__inner">
        <div className="contact__left">
          <p className="section-label reveal">
            <span>{t("contact.label")}</span>
          </p>
          <h2 className="contact__title">
            <span className="line">
              <span className="line__inner">{t("contact.t1")}</span>
            </span>
            <span className="line">
              <span className="line__inner line__inner--accent">{t("contact.t2")}</span>
            </span>
          </h2>
          <div className="contact__details reveal">
            <a href="mailto:info@vortexmedialab.mx" className="contact__email" data-cursor="copy">
              info@vortexmedialab.mx
            </a>
            <p className="contact__loc">{t("contact.loc")}</p>
            <div className="contact__socials">
              <a
                href="https://www.facebook.com/vortexmedialabmx/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-cursor="link"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M13.5 21v-6.7h2.2l.3-2.6h-2.5V9.9c0-.75.2-1.27 1.29-1.27h1.38V6.3c-.24-.03-1.05-.1-2-.1-1.98 0-3.33 1.2-3.33 3.42v1.9H8.5v2.6h2.3V21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/vortex-media-lab/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                data-cursor="link"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vortexmedialab/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-cursor="link"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@vortexmedialab"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                data-cursor="link"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M14 3v10.6a2.9 2.9 0 11-2.4-2.86"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3c.3 2.1 1.8 3.7 4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <form
          className="contact__form reveal"
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          noValidate
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              No llenar: <input name="bot-field" value={fields["bot-field"]} onChange={onChange} />
            </label>
          </p>

          <div className="field">
            <label htmlFor="name">{t("form.name")}</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={fields.name}
              onChange={onChange}
              className={errors.name ? "is-error" : undefined}
            />
          </div>
          <div className="field">
            <label htmlFor="email">{t("form.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={fields.email}
              onChange={onChange}
              className={errors.email ? "is-error" : undefined}
            />
          </div>
          <div className="field">
            <label htmlFor="type">{t("form.type")}</label>
            <select id="type" name="type" value={fields.type} onChange={onChange}>
              <option value="design">{t("form.opt1")}</option>
              <option value="av">{t("form.opt2")}</option>
              <option value="event">{t("form.opt3")}</option>
              <option value="other">{t("form.opt4")}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="message">{t("form.msg")}</label>
            <textarea
              id="message"
              name="message"
              rows="3"
              value={fields.message}
              onChange={onChange}
              className={errors.message ? "is-error" : undefined}
            />
          </div>
          <button type="submit" className="btn btn--solid btn--full" disabled={status === "sending"}>
            {t("form.send")}
          </button>
          <p
            className={`form__status${status === "invalid" || status === "networkError" ? " is-error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {statusText}
          </p>
        </form>
      </div>
    </section>
  );
}
