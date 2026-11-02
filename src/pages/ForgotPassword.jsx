import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, isRecoveryLink, isLinkExpired } from "../supabaseClient";
import "./ForgotPassword.css";
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

function Field({ id, label, icon, children }) {
  return (
    <div className="reg-field">
      <label htmlFor={id}>{label}</label>
      <div className="reg-shell reg-shell--icon">
        <Icon>{icon}</Icon>
        {children}
      </div>
    </div>
  );
}

export default function ForgotPage() {
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState(isRecoveryLink);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(
    isLinkExpired ? "Linkin müddəti bitib. Yeni link istəyin." : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const sendLink = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot`,
    });
    setLoading(false);
    if (error) return setError(authErrorText(error));
    setSent(true);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Şifrə ən azı 8 simvol olmalıdır.");
    if (password !== password2) return setError("Şifrələr uyğun gəlmir.");

    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setLoading(false);
      setRecovery(false);
      return setError("Linkin müddəti bitib. Yeni link istəyin.");
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(authErrorText(error));

    await supabase.auth.signOut();
    setDone(true);
    setTimeout(() => navigate("/"), 3000);
  };

  const arrow = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  const lockIcon = (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  );

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
              <path d="M36 15v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="36" cy="28" r="2" fill="currentColor" />
            </svg>
          </span>
          <span className="reg-brand__name">Dərsim</span>
        </div>

        {done ? (
          <div className="reg-success">
            <div className="reg-success__icon">✓</div>
            <h2>Şifrə dəyişdirildi</h2>
            <p>Giriş səhifəsinə yönləndirilirsiniz...</p>
          </div>
        ) : sent ? (
          <div className="reg-success">
            <div className="reg-success__icon">✉</div>
            <h2>Emailinizi yoxlayın</h2>
            <p>
              <b>{email}</b> ünvanına şifrə sıfırlama linki göndərildi. Mail gəlmirsə,
              spam qovluğuna baxın.
            </p>
            <p className="reg-login">
              <Link to="/">Giriş səhifəsinə qayıt</Link>
            </p>
          </div>
        ) : (
          <div className="reg-container reg-container--narrow">
            <Link to="/" className="reg-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Giriş səhifəsinə qayıt
            </Link>

            {recovery ? (
              <>
                <span className="reg-kicker">Şifrənin yenilənməsi</span>
                <h1 className="reg-title">Yeni şifrə təyin edin</h1>
                <p className="reg-sub">Hesabınız üçün yeni şifrə yazın.</p>

                <form onSubmit={changePassword}>
                  <div className="reg-stack">
                    <Field id="password" label="Yeni şifrə" icon={lockIcon}>
                      <input
                        id="password"
                        type="password"
                        required
                        placeholder="Ən azı 8 simvol"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field>
                    <Field
                      id="password2"
                      label="Şifrə təkrarı"
                      icon={<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>}
                    >
                      <input
                        id="password2"
                        type="password"
                        required
                        placeholder="Şifrənizi təkrarlayın"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                      />
                    </Field>
                  </div>

                  {error && <p className="reg-error">{error}</p>}

                  <button className="reg-submit" type="submit" disabled={loading}>
                    {loading ? "Gözləyin..." : "Şifrəni dəyiş"}
                    {!loading && arrow}
                  </button>
                </form>
              </>
            ) : (
              <>
                <span className="reg-kicker">Şifrənin bərpası</span>
                <h1 className="reg-title">Şifrəni unutmusunuz?</h1>
                <p className="reg-sub">
                  Qeydiyyatda yazdığınız emaili daxil edin, sizə sıfırlama linki göndərək.
                </p>

                <form onSubmit={sendLink}>
                  <div className="reg-stack">
                    <Field
                      id="email"
                      label="Email"
                      icon={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}
                    >
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                  </div>

                  {error && <p className="reg-error">{error}</p>}

                  <button className="reg-submit" type="submit" disabled={loading}>
                    {loading ? "Göndərilir..." : "Link göndər"}
                    {!loading && arrow}
                  </button>
                </form>
              </>
            )}
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