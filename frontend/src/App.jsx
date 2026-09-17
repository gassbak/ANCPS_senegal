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

import BackofficeRoute from "./backoffice/BackofficeRoute";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          SITE PUBLIC
      ========================== */}

      <Route
        path="/"
        element={<Navigate to="/register" replace />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =========================
          SITE VISITEUR PROTÉGÉ
      ========================== */}

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


      {/* =========================
          BACK-OFFICE
      ========================== */}

      <Route
        path="/admin/*"
        element={<BackofficeRoute />}
      />


      {/* =========================
          URL INCONNUE
      ========================== */}

      <Route
        path="*"
        element={<Navigate to="/register" replace />}
      />

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
