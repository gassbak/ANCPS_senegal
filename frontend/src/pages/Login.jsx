
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50">

    
      {/* FORMULAIRE */}
      <main className="flex justify-center px-4 py-12">

        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-8">

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Se connecter
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-8">
            Connectez-vous à votre compte
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#064E3B] text-white py-3 rounded-lg font-semibold hover:bg-[#053B2C] transition"
            >
              Se connecter
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Vous n'avez pas encore de compte ?{" "}

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#064E3B] font-semibold hover:underline"
            >
              Créer un compte
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Login;

