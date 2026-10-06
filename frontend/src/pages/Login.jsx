
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Garde ici ton système actuel de connexion
      // await login(email, password);

      navigate("/");
    } catch (error) {
      setError(
        error.message ||
        "Erreur lors de la connexion."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-5 py-10">

      <div className="mx-auto w-full max-w-[448px]">

        <div className="rounded-[12px] border border-black bg-white px-8 py-9 shadow-sm">

          {/* TITRE */}
          <div className="mb-8 text-center">
            <h1 className="text-[24px] font-bold text-[#0f172a]">
              Se connecter
            </h1>

            <p className="mt-2 text-[15px] text-[#64748b]">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>


          {/* ERREUR */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* EMAIL */}
          <div className="mb-5">

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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="votre@email.com"
              autoComplete="email"
              className="h-[50px] w-full rounded-lg border border-[#cbd5e1] bg-white px-4 text-[15px] text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46]"
            />

          </div>


          {/* MOT DE PASSE */}
          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-[14px] font-medium text-[#0f2b4d]"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              className="h-[50px] w-full rounded-lg border border-[#cbd5e1] bg-white px-4 text-[15px] text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46]"
            />

          </div>


          {/* MOT DE PASSE OUBLIÉ */}
          <div className="mt-3 mb-6 flex justify-end">

            <Link
              to="/mot-de-passe-oublie"
              className="text-[14px] font-semibold text-[#065f46] hover:text-[#064e3b] hover:underline"
            >
              Mot de passe oublié ?
            </Link>

          </div>


          {/* BOUTON */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="h-[48px] w-full rounded-lg bg-[#065f46] text-[15px] font-bold text-white transition hover:bg-[#064e3b]"
          >
            Se connecter
          </button>


          {/* INSCRIPTION */}
          <p className="mt-6 text-center text-[14px] text-[#64748b]">

            Vous n'avez pas encore de compte ?{" "}

            <Link
              to="/inscription"
              className="font-semibold text-[#065f46] hover:underline"
            >
              Créer un compte
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}
