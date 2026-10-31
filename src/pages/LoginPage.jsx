import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LoginPage.css";

function Logo({ light = false }) {
  return (
    <div className={`brand ${light ? "brand--light" : ""}`}>
      <span className="brand__mark" aria-hidden="true">
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
      <span className="brand__name">Dərsim</span>
    </div>
  );
}

function Icon({ children, className = "" }) {
  return (
    <svg
      className={className}
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

function DashboardPreview() {
  const chart = [42, 58, 49, 72, 64, 84, 78, 94];

  return (
    <div className="dashboard-wrap" aria-hidden="true">
      <div className="glow-orbit glow-orbit--one" />
      <div className="glow-orbit glow-orbit--two" />

      <div className="float-card float-card--students">
        <span className="float-card__icon">
          <Icon>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </Icon>
        </span>
        <span>
          <small>Aktiv şagirdlər</small>
          <strong>248</strong>
        </span>
        <em>+12%</em>
      </div>

      <div className="float-card float-card--payment">
        <span className="check-badge">
          <Icon>
            <path d="m5 12 4 4L19 6" />
          </Icon>
        </span>
        <span>
          <small>Ödəniş qəbul edildi</small>
          <strong>₼ 120.00</strong>
        </span>
      </div>

      <div className="dashboard">
        <div className="dashboard__sidebar">
          <span className="mini-logo">
            <svg viewBox="0 0 42 42" fill="none">
              <path d="M6 14.5 21 7l15 7.5L21 22 6 14.5Z" fill="currentColor" />
              <path
                d="M11 19v9.4c0 2.2 4.5 5.6 10 5.6s10-3.4 10-5.6V19l-10 5-10-5Z"
                fill="currentColor"
                opacity=".75"
              />
            </svg>
          </span>
          <span className="sidebar-item sidebar-item--active">
            <Icon>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </Icon>
          </span>
          <span className="sidebar-item">
            <Icon>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </Icon>
          </span>
          <span className="sidebar-item">
            <Icon>
              <rect x="3" y="5" width="18" height="15" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" />
            </Icon>
          </span>
          <span className="sidebar-item">
            <Icon>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </Icon>
          </span>
        </div>

        <div className="dashboard__body">
          <div className="dash-topbar">
            <div>
              <small>Xoş gəldin,</small>
              <strong>Elvin müəllim</strong>
            </div>
            <span className="dash-avatar">EM</span>
          </div>

          <div className="metric-row">
            <div className="metric">
              <span className="metric__icon metric__icon--blue">
                <Icon>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </Icon>
              </span>
              <small>Şagirdlər</small>
              <strong>248</strong>
            </div>
            <div className="metric">
              <span className="metric__icon metric__icon--cyan">
                <Icon>
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 10h18" />
                </Icon>
              </span>
              <small>Bu gün</small>
              <strong>6 dərs</strong>
            </div>
            <div className="metric">
              <span className="metric__icon metric__icon--green">
                <Icon>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </Icon>
              </span>
              <small>Ödənişlər</small>
              <strong>₼ 4.8k</strong>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card__head">
              <span>
                <small>Aylıq gəlir</small>
                <strong>₼ 4,860</strong>
              </span>
              <em>+18.2%</em>
            </div>
            <div className="chart">
              <div className="chart__grid">
                <i />
                <i />
                <i />
              </div>
              <div className="chart__bars">
                {chart.map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { data, error: loginError } = await supabase.rpc("login_check", {
      p_istifadeci_adi: username,
      p_sifre: password,
    });
    if (loginError || !data || data.length === 0) {
      setError("İstifadəçi adı və ya şifrə yanlışdır.");
      return;
    }
    localStorage.setItem("dersim_user", JSON.stringify(data[0]));
    navigate("/main");
  };

  return (
    <main className="login-page">
      <section className="showcase">
        <div className="showcase__noise" />
        <div className="showcase__top">
          <Logo light />
          <span className="secure-badge">
            <span />
            Təhlükəsiz platforma
          </span>
        </div>

        <div className="showcase__copy">
          <span className="eyebrow">Təhsilin ağıllı idarəetməsi</span>
          <h1>
            Dərsləriniz.
            <br />
            <span>Nəzarətinizdə.</span>
          </h1>
          <p>
            Şagirdlərinizi, dərs cədvəlinizi və ödənişlərinizi bir paneldən
            rahatlıqla idarə edin.
          </p>
        </div>

        <DashboardPreview />
        <p className="showcase__footer">
          © 2026 Dərsim.Müəllimlər və şagirdlər üçün hazırlanıb
        </p>
      </section>

      <section className="auth">
        <div className="mobile-logo">
          <Logo />
        </div>
        <div className="auth__inner">
          <div className="auth__heading">
            <span className="auth__kicker">Şəxsi kabinet</span>
            <h2>Yenidən xoş gəldiniz</h2>
            <p>Hesabınıza daxil olmaq üçün məlumatlarınızı qeyd edin.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label className="field">
              <span>İstifadəçi adı</span>
              <span className="input-shell">
                <Icon className="input-icon">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </Icon>
                <input
                  type="text"
                  name="username"
                  placeholder="İstifadəçi adınızı yazın"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </span>
            </label>

            <label className="field">
              <span>Şifrə</span>
              <span className="input-shell">
                <Icon className="input-icon">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </Icon>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Şifrənizi yazın"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="visibility"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"
                  }
                >
                  <Icon>
                    {showPassword ? (
                      <>
                        <path d="m3 3 18 18" />
                        <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                        <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2 3.2M6.6 6.6C3.4 8.7 2 12 2 12s3 8 10 8a9.8 9.8 0 0 0 5.4-1.6" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </Icon>
                </button>
              </span>
            </label>

            <div className="form-options">
              <Link to="/forgot">Şifrəni unutmusunuz?</Link>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="submit-button" type="submit">
              Daxil ol
              <Icon>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Icon>
            </button>
          </form>

          <div className="divider">
            <span>və ya</span>
          </div>

          <p className="register">
            Hesabınız yoxdur? <Link to="/qeydiyyat">Qeydiyyatdan keçin</Link>
          </p>
        </div>

        <div className="auth__footer">
          <span>Kömək və dəstək</span>
          <span>•</span>
          <span>AZ</span>
        </div>
      </section>
    </main>
  );
}
