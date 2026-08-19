import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendOtp } from "../services/auth.service";

interface LocationState {
  email?: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // secondes

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  // L'email vient du Register (navigate state). Si absent (accès direct
  // à l'URL), on redirige vers l'inscription.
  const email = (location.state as LocationState | null)?.email;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);

    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    const otp = digits.join("");
    setError("");
    setSuccess("");

    if (otp.length < OTP_LENGTH) {
      setError("Merci de saisir les 6 chiffres du code.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(email, otp);
      setSuccess("Adresse email vérifiée ! Redirection vers la connexion...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      await resendOtp(email);
      setSuccess("Un nouveau code a été envoyé.");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de renvoyer le code pour le moment.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-white bg-[repeating-linear-gradient(45deg,#1e293b08_0px,#1e293b08_1px,transparent_1px,transparent_20px)]"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--mouse-x", x + "%");
        e.currentTarget.style.setProperty("--mouse-y", y + "%");
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(30,41,59,0.15), transparent 80%)",
        }}
      >
        <nav className="w-full px-6 py-4 flex items-center justify-between relative z-10 bg-gray-100 backdrop-blur-md border-b border-gray-200">
          <div className="text-4xl font-bold ml-20 cursor-pointer">
            <Link to="/">
              <span className="text-[#1e293b]">Market</span>
              <span className="text-[#42b883]">Place</span>
            </Link>
          </div>
        </nav>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10 w-full">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#616368] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="w-full p-8 md:p-10">
              <div className="flex justify-center mb-6">
                <span className="text-4xl font-extrabold tracking-tight">
                  <span className="text-white/90">Market</span>
                  <span className="text-[#42b883] drop-shadow-[0_0_12px_rgba(66,184,131,0.5)]">Place</span>
                </span>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white/95 tracking-tight">Vérification email</h1>
                <div className="w-10 h-1 bg-[#42b883] rounded-full mx-auto mt-3"></div>
                <p className="text-sm text-white/50 mt-3">
                  Code envoyé à <span className="text-white/80 font-medium">{email}</span>
                </p>
              </div>

              {success && (
                <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-green-500/10 backdrop-blur-sm border border-green-500/20 px-4 py-3 text-sm text-green-200">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-500/10 backdrop-blur-sm border border-red-500/20 px-4 py-3 text-sm text-red-200">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2.5">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputsRef.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="w-11 h-13 text-center text-lg font-bold rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#42b883]/50 focus:border-[#42b883]/50 transition"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-3/4 cursor-pointer mx-auto block rounded-lg bg-[#42b883] text-white text-sm font-medium py-2.5 px-6 hover:bg-[#3aa876] hover:shadow-[0_0_30px_rgba(66,184,131,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Vérification..." : "Vérifier"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || cooldown > 0}
                    className="text-sm text-white/50 hover:text-[#42b883] transition disabled:hover:text-white/50 disabled:cursor-not-allowed"
                  >
                    {cooldown > 0
                      ? `Renvoyer le code (${cooldown}s)`
                      : resendLoading
                      ? "Envoi..."
                      : "Renvoyer le code"}
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-white/50 hover:text-[#42b883] transition inline-flex items-center gap-1.5"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;