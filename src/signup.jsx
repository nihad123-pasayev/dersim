import "./RegisterChoice.css";

export default function RegisterChoice() {
  return (
    <div className="register-page">
      <main>
        <div className="brand">
          <span className="brand-mark" />
          Dərsim
        </div>
        <p className="tagline">Necə qeydiyyatdan keçmək istəyirsiniz?</p>

        <div className="choice-grid">
          <a className="choice-card" href="/qeydiyyat/telebe">
            <span className="choice-icon" />
            <h3>Tələbə kimi</h3>
            <p>Repetitorunuzu izləyin, dərs cədvəlinizi və ödənişlərinizi görün.</p>
            <span className="choice-cta">Davam et →</span>
          </a>

          <a className="choice-card" href="/qeydiyyat/muellim">
            <span className="choice-icon" />
            <h3>Müəllim kimi</h3>
            <p>Tələbələrinizi, dərs cədvəlinizi və ödənişləri idarə edin.</p>
            <span className="choice-cta">Davam et →</span>
          </a>
        </div>

        <p className="signup-line">
          Artıq hesabınız var? <a href="/daxil-ol">Daxil olun</a>
        </p>
      </main>

      <footer>
        <div className="footer-inner">
          <span>© 2026 Dərsim</span>
          <span>Repetitorlar üçün hazırlanıb</span>
        </div>
      </footer>
    </div>
  );
}