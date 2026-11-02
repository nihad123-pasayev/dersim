const byCode = {
  same_password: "Yeni şifrə köhnə şifrədən fərqli olmalıdır.",
  weak_password: "Şifrə çox zəifdir. Hərf, rəqəm və simvol qarışığı istifadə edin.",
  otp_expired: "Linkin müddəti bitib. Yeni link istəyin.",
  session_not_found: "Sessiya tapılmadı. Yeni link istəyin.",
  invalid_credentials: "İstifadəçi adı və ya şifrə yanlışdır.",
  email_not_confirmed: "Email təsdiqlənməyib. Poçtunuzdakı linki yoxlayın.",
  user_already_exists: "Bu email ilə artıq hesab var.",
  email_exists: "Bu email ilə artıq hesab var.",
  email_address_invalid: "Email ünvanı yanlışdır.",
  user_not_found: "Bu email ilə hesab tapılmadı.",
  signup_disabled: "Qeydiyyat hazırda bağlıdır.",
  over_email_send_rate_limit: "Link artıq göndərilib. Yenidən istəmək üçün 60 saniyə gözləyin.",
  over_request_rate_limit: "Çox sorğu göndərdiniz. Bir az gözləyib yenidən cəhd edin.",
};

const byMessage = [
  [/different from the old password/i, byCode.same_password],
  [/auth session missing/i, byCode.session_not_found],
  [/invalid login credentials/i, byCode.invalid_credentials],
  [/email not confirmed/i, byCode.email_not_confirmed],
  [/already registered|already been registered/i, byCode.user_already_exists],
  [/password should be at least/i, "Şifrə çox qısadır."],
  [/rate limit|only request this once|too many/i, byCode.over_request_rate_limit],
  [/unable to validate email|invalid email/i, byCode.email_address_invalid],
  [/failed to fetch|network/i, "İnternet bağlantısını yoxlayın və yenidən cəhd edin."],
];

export function authErrorText(error) {
  if (!error) return "";
  if (error.code && byCode[error.code]) return byCode[error.code];

  const msg = error.message || "";
  for (const [pattern, text] of byMessage) {
    if (pattern.test(msg)) return text;
  }
  return "Xəta baş verdi. Bir az sonra yenidən cəhd edin.";
}