import { Link } from "react-router-dom";
import "./RegisterChoice.css";

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
          <path d="M36 15v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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
              <path d="M11 19v9.4c0 2.2 4.5 5.6 10 5.6s10-3.4 10-5.6V19l-10 5-10-5Z" fill="currentColor" opacity=".75" />
            </svg>
          </span>
          <span className="sidebar-item sidebar-item--active">
            <Icon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>
          </span>
          <span className="sidebar-item">
            <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></Icon>
          </span>
          <span className="sidebar-item">
            <Icon><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></Icon>
          </span>
          <span className="sidebar-item">
            <Icon><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></Icon>
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
                <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></Icon>
              </span>
              <small>Şagirdlər</small>
              <strong>248</strong>
            </div>
            <div className="metric">
              <span className="metric__icon metric__icon--cyan">
                <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /></Icon>
              </span>
              <small>Bu gün</small>
              <strong>6 dərs</strong>
            </div>
            <div className="metric">
              <span className="metric__icon metric__icon--green">
                <Icon><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>
              </span>
              <small>Ödənişlər</small>
              <strong>₼ 4.8k</strong>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card__head">
              <span><small>Aylıq gəlir</small><strong>₼ 4,860</strong></span>
              <em>+18.2%</em>
            </div>
            <div className="chart">
              <div className="chart__grid"><i /><i /><i /></div>
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

export default function RegisterChoice() {
  return (
    <main className="register-choice-page">
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
          <span className="eyebrow">Təhsil dünyasına qoşulun</span>
          <h1>
            Öyrənin. Öyrədin.
            <br />
            <span>İnkişaf edin.</span>
          </h1>
          <p>
            Məqsədinizə uyğun hesabı seçin və təhsil prosesinizi daha ağıllı
            şəkildə idarə etməyə başlayın.
          </p>
        
        </div>

        <DashboardPreview />
        <p className="showcase__footer">© 2026 Dərsim.Müəllimlər və şagirdlər üçün hazırlanıb.</p>
      </section>

      <section className="auth">
        <div className="mobile-logo"><Logo /></div>

        <div className="auth__inner auth__inner--roles">
          <Link className="back-button" to="/">
            <Icon><path d="m15 18-6-6 6-6" /></Icon>
            Girişə qayıt
          </Link>

          <div className="auth__heading">
            <span className="auth__kicker">Yeni hesab</span>
            <h2>Necə qeydiyyatdan keçmək istəyirsiniz?</h2>
            <p>Sizə uyğun hesab növünü seçin və Dərsim ailəsinə qoşulun.</p>
          </div>

          <div className="role-list">
            <Link className="role-card" to="/qeydiyyat/sagird">
              <span className="role-card__icon role-card__icon--student">
                <Icon>
                  <path d="m3 10 9-5 9 5-9 5-9-5Z" />
                  <path d="M7 12.2V17c2.7 2.1 7.3 2.1 10 0v-4.8M21 10v6" />
                </Icon>
              </span>
              <span className="role-card__content">
                <span className="role-card__eyebrow">Öyrənmək üçün</span>
                <strong>Şagird kimi</strong>
                <small>Repetitorunuzu izləyin, dərs cədvəlinizə və ödənişlərinizə baxın.</small>
                <span className="role-card__action">
                  Davam et
                  <Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
                </span>
              </span>
            </Link>

            <Link className="role-card" to="/qeydiyyat/muellim">
              <span className="role-card__icon role-card__icon--teacher">
                <Icon>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2M16.5 13.8l-4.5 3-4.5-3" />
                </Icon>
              </span>
              <span className="role-card__content">
                <span className="role-card__eyebrow">Öyrətmək üçün</span>
                <strong>Müəllim kimi</strong>
                <small>Şagirdlərinizi, dərs cədvəlinizi və bütün ödənişlərinizi idarə edin.</small>
                <span className="role-card__action">
                  Davam et
                  <Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
                </span>
              </span>
            </Link>
          </div>

          <div className="role-benefit">
            <span className="role-benefit__icon">
              <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></Icon>
            </span>
            <span>
              <strong>Məlumatlarınız qorunur</strong>
              <small>Qeydiyyat pulsuzdur və cəmi bir neçə dəqiqə çəkir.</small>
            </span>
          </div>

          <p className="register">
            Artıq hesabınız var? <Link className="text-action" to="/">Daxil olun</Link>
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