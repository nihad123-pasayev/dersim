import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Bothregister.css";
import { authErrorText } from "../authErrors";

function Icon({ children }) {
  return (
    <svg
      className="reg-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Field({ id, label, hint, icon, full = false, children }) {
  return (
    <div className={`reg-field ${full ? "reg-field--full" : ""}`}>
      <label htmlFor={id}>
        {label}
        {hint && <small>{hint}</small>}
      </label>
      <div className={`reg-shell ${icon ? "reg-shell--icon" : ""}`}>
        {icon && <Icon>{icon}</Icon>}
        {children}
      </div>
    </div>
  );
}

export default function TeacherRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    adSoyad: "",
    yas: "",
    fenn: "",
    telefon: "",
    email: "",
    seher: "",
    istifadeciAdi: "",
    kod: "",
    kodTekrar: "",
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = form.istifadeciAdi.trim();
    const email = form.email.trim();

    if (/\s/.test(username)) {
      setError("İstifadəçi adında boşluq ola bilməz.");
      return;
    }
    if (form.kod.length < 8) {
      setError("Şifrə ən azı 8 simvol olmalıdır.");
      return;
    }
    if (form.kod !== form.kodTekrar) {
      setError("Şifrələr uyğun gəlmir.");
      return;
    }

    setLoading(true);

    const { data: available, error: checkError } = await supabase.rpc(
      "username_available",
      { p_istifadeci_adi: username },
    );
    if (checkError) {
      setLoading(false);
      setError(
        "Yoxlama zamanı xəta baş verdi. Bir az sonra yenidən cəhd edin.",
      );
      return;
    }
    if (!available) {
      setLoading(false);
      setError("Bu istifadəçi adı artıq mövcuddur.");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.kod,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role: "teacher",
          ad_soyad: form.adSoyad,
          yas: form.yas,
          fenn: form.fenn,
          telefon: form.telefon,
          seher: form.seher,
          istifadeci_adi: username,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(authErrorText(signUpError));
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/"), 3000);
  };
  return (
    <div className="reg-page">
      <main className="reg-main">
        <div className="reg-brand">
          <span className="reg-brand__mark" aria-hidden="true">
            <svg viewBox="0 0 42 42" fill="none">
              <path d="M6 14.5 21 7l15 7.5L21 22 6 14.5Z" fill="currentColor" />
              <path
                d="M11 19v9.4c0 2.2 4.5 5.6 10 5.6s10-3.4 10-5.6V19l-10 5-10-5Z"
                fill="currentColor"
                opacity=".78"
              />
              <path
                d="M36 15v10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="36" cy="28" r="2" fill="currentColor" />
            </svg>
          </span>
          <span className="reg-brand__name">Dərsim</span>
        </div>

        {success ? (
          <div className="reg-success">
            <div className="reg-success__icon">✓</div>
            <h2>Qeydiyyat uğurludur!</h2>
            <p>Giriş səhifəsinə yönləndirilirsiniz...</p>
          </div>
        ) : (
          <div className="reg-container">
            <Link to="/qeydiyyat" className="reg-back">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Hesab seçiminə qayıt
            </Link>

            <span className="reg-kicker">Müəllim qeydiyyatı</span>
            <h1 className="reg-title">Dərs verməyə başlayın</h1>
            <p className="reg-sub">
              Məlumatlarınızı daxil edin və şəxsi idarəetmə panelinizi yaradın.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="reg-grid">
                <Field
                  id="adSoyad"
                  label="Ad və soyad"
                  full
                  icon={
                    <>
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </>
                  }
                >
                  <input
                    id="adSoyad"
                    name="adSoyad"
                    type="text"
                    required
                    placeholder="Adınızı və soyadınızı yazın"
                    value={form.adSoyad}
                    onChange={handleChange}
                  />
                </Field>

                <Field id="yas" label="Yaş">
                  <input
                    id="yas"
                    name="yas"
                    type="number"
                    min="18"
                    max="99"
                    required
                    placeholder="Məsələn, 28"
                    value={form.yas}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="fenn"
                  label="Fənn"
                  icon={
                    <>
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                    </>
                  }
                >
                  <input
                    id="fenn"
                    name="fenn"
                    type="text"
                    required
                    placeholder="Məsələn, Riyaziyyat"
                    value={form.fenn}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="telefon"
                  label="Telefon nömrəsi"
                  icon={
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                  }
                >
                  <input
                    id="telefon"
                    name="telefon"
                    type="tel"
                    required
                    placeholder="+994 XX XXX XX XX"
                    value={form.telefon}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="email"
                  label="Email"
                  icon={
                    <>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </>
                  }
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    readOnly
                    onFocus={(e) => e.target.removeAttribute("readonly")}
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="seher"
                  label="Şəhər"
                  icon={
                    <>
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </>
                  }
                >
                  <input
                    id="seher"
                    name="seher"
                    type="text"
                    required
                    placeholder="Yaşadığınız şəhər"
                    value={form.seher}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="istifadeciAdi"
                  label="İstifadəçi adı"
                  icon={
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v8M8 12h8" />
                    </>
                  }
                >
                  <input
                    id="istifadeciAdi"
                    name="istifadeciAdi"
                    type="text"
                    required
                    placeholder="İstifadəçi adı təyin edin"
                    value={form.istifadeciAdi}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="kod"
                  label="Şifrə"
                  icon={
                    <>
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </>
                  }
                >
                  <input
                    id="kod"
                    name="kod"
                    type="password"
                    required
                    placeholder="Ən azı 8 simvol"
                    value={form.kod}
                    onChange={handleChange}
                  />
                </Field>

                <Field
                  id="kodTekrar"
                  label="Şifrə təkrarı"
                  icon={
                    <>
                      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                      <path d="M21 3v5h-5" />
                    </>
                  }
                >
                  <input
                    id="kodTekrar"
                    name="kodTekrar"
                    type="password"
                    required
                    placeholder="Şifrənizi təkrarlayın"
                    value={form.kodTekrar}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              <label className="reg-check">
                <input
                  type="checkbox"
                  required
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  <b>İstifadə şərtləri</b> və məxfilik siyasəti ilə razıyam.
                </span>
              </label>

              {error && <p className="reg-error">{error}</p>}

              <button className="reg-submit" type="submit" disabled={loading}>
                {loading ? "Gözləyin..." : "Hesabımı yarat"}
                {!loading && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>

              <p className="reg-login">
                Artıq hesabınız var? <Link to="/">Daxil olun</Link>
              </p>
            </form>
          </div>
        )}
      </main>

      <footer className="reg-footer">
        <span>© 2026 Dərsim</span>
        <span>Repetitorlar və şagirdlər üçün hazırlanıb</span>
      </footer>
    </div>
  );
}
