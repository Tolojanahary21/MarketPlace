import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import InputOtp from "../components/InputOTP";
import { verifyEmail, resendOtp } from "../services/auth.service";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email as string | undefined;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Veuillez entrer les 6 chiffres du code.");
      return;
    }

    if (!email) {
      setError("Adresse email introuvable.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await verifyEmail({
        email,
        otp,
      });

      setSuccess("Email vérifié avec succès !");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Code OTP invalide ou expiré.");
      } else if (err.response?.status === 429) {
        setError(
          err.response?.data?.message ||
            "Trop de tentatives. Veuillez patienter avant de réessayer."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Une erreur est survenue lors de la vérification."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Adresse email introuvable.");
      return;
    }

    setError("");
    setSuccess("");
    setResending(true);

    try {
      await resendOtp({ email });

      setSuccess("Un nouveau code OTP a été envoyé.");
      setOtp("");
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(
          err.response?.data?.message ||
            "Veuillez patienter avant de demander un nouveau code."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Impossible de renvoyer le code OTP."
        );
      }
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1e293b]">
            Vérification impossible
          </h1>

          <p className="mt-3 text-gray-500">
            Aucune adresse email n'a été fournie.
          </p>

          <Link
            to="/register"
            className="inline-block mt-5 text-[#42b883] font-medium"
          >
            Retour à l'inscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white bg-[repeating-linear-gradient(45deg,#1e293b08_0px,#1e293b08_1px,transparent_1px,transparent_20px)]">
      <div className="w-full max-w-md">
        <div className="bg-[#616368] rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10">

          <div className="flex justify-center mb-6">
            <span className="text-4xl font-extrabold tracking-tight">
              <span className="text-white/90">Market</span>
              <span className="text-[#42b883]">
                Place
              </span>
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">
              Vérification de votre email
            </h1>

            <div className="w-10 h-1 bg-[#42b883] rounded-full mx-auto mt-3" />

            <p className="text-sm text-white/60 mt-4">
              Nous avons envoyé un code à
            </p>

            <p className="text-sm font-semibold text-[#42b883] mt-1">
              {email}
            </p>
          </div>

          {success && (
            <div className="mb-5 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-200">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <InputOtp
              value={otp}
              onChange={setOtp}
              disabled={loading}
            />

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full rounded-lg bg-[#42b883] text-white font-medium py-3 hover:bg-[#3aa876] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Vérification..." : "Vérifier mon email"}
            </button>

            <div className="text-center">
              <p className="text-sm text-white/50">
                Vous n'avez pas reçu le code ?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-2 text-[#42b883] hover:text-[#5fd3a0] font-medium transition disabled:opacity-50"
              >
                {resending ? "Envoi..." : "Renvoyer le code"}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm text-white/50 hover:text-[#42b883] transition"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;