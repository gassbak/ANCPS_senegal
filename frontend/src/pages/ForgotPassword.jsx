import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    // Simulation front-end pour le moment
    setMessage(
      "Si cette adresse est associée à un compte, vous recevrez un lien pour réinitialiser votre mot de passe."
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-5 py-10">
      <div className="mx-auto w-full max-w-[448px]">

        <div className="rounded-[12px] border border-black bg-white px-8 py-9 shadow-sm">

          {/* TITRE */}
          <div className="mb-8 text-center">
            <h1 className="text-[24px] font-bold text-[#0f172a]">
              Mot de passe oublié ?
            </h1>

            <p className="mt-2 text-[15px] leading-6 text-[#64748b]">
              Entrez votre adresse email pour récupérer
              votre mot de passe.
            </p>
          </div>

          {/* ERREUR */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* MESSAGE */}
          {message && (
            <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
              {message}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-[14px] font-medium text-[#0f2b4d]"
            >
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              autoComplete="email"
              className="h-[50px] w-full rounded-lg border border-[#cbd5e1] bg-white px-4 text-[15px] text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46]"
            />
          </div>

          {/* BOUTON */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="h-[48px] w-full rounded-lg bg-[#065f46] text-[15px] font-bold text-white transition hover:bg-[#064e3b]"
          >
            Envoyer le lien
          </button>

          {/* RETOUR */}
          <Link
            to="/login"
            className="mt-6 block text-center text-[14px] font-medium text-[#065f46] hover:underline"
          >
            ← Retour à la connexion
          </Link>

        </div>
      </div>
    </div>
  );
}