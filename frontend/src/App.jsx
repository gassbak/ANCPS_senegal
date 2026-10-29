
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Annuaire from "./pages/Annuaire";
import CertificationDetail from "./pages/CertificationDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminRoutes from "./admin/routes/AdminRoutes";

import {
  AuthProvider,
  useAuth
} from "./context/AuthContext";

import AdminRoutes from "./admin/routes/AdminRoutes";

import {
  AuthProvider,
  useAuth,
>>>>>>> a6aea49e33c651f4964064f880a0dceb95f5d967

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

      {/* PREMIÈRE PAGE : CONNEXION */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* CONNEXION */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/mot-de-passe-oublie"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

      {/* BACK-OFFICE */}

      <Route
        path="/admin/*"
        element={<AdminRoutes />}
      />

      {/* URL INCONNUE */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

          <Route
            path="/certification/:id"
            element={<CertificationDetail />}
          />

          {/* Espace utilisateur */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          {/* Administration */}
          <Route
            path="/admin/*"
            element={<AdminRoutes />}
          />

          {/* Route inconnue */}
          <Route
            path="*"
            element={
              <Navigate
                to="/register"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

