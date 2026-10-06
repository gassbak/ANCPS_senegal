```jsx
import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    if (!password.trim()) {
      setError("Veuillez saisir votre mot de passe.");
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim(),
        password
      );

      navigate("/home");

    } catch (error) {
      console.error(
        "Erreur de connexion :",
        error
      );

      setError(
        error.message ||
        "Email ou mot de passe incorrect."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto w-full max-w-[448px]">

        {/* CARTE */}
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-9">

          {/* EN-TÊTE */}
          <div className="mb-8 text-center">

            <h1 className="text-2xl font-bold text-[#0f172a]">
              Se connecter
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Connectez-vous pour accéder à votre compte
            </p>

          </div>


          {/* MESSAGE D'ERREUR */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}


          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="mb-5">

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#0f2b4d]"
              >
                Adresse email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="votre@email.com"
                autoComplete="email"
                disabled={loading}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] bg-white px-4 text-sm text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#065f46] focus:ring-2 focus:ring-[#065f46]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>


            {/* MOT DE PASSE */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#0f2b4d]"
              >
                Mot de passe
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                disabled={loading}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] bg-white px-4 text-sm text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#065f46] focus:ring-2 focus:ring-[#065f46]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>


            {/* MOT DE PASSE OUBLIÉ */}
            <div className="mt-3 mb-6 text-right">

              <Link
                to="/mot-de-passe-oublie"
                className="text-sm font-semibold text-[#065f46] hover:text-[#064e3b] hover:underline"
              >
                Mot de passe oublié ?
              </Link>

            </div>


            {/* BOUTON CONNEXION */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-[#065f46] text-sm font-bold text-white transition hover:bg-[#064e3b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Connexion..."
                : "Se connecter"}
            </button>

          </form>


          {/* INSCRIPTION */}
          <p className="mt-6 text-center text-sm leading-6 text-[#64748b]">

            Vous n'avez pas encore de compte ?{" "}

            <Link
              to="/register"
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
