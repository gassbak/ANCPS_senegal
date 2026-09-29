
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

import AdminRoutes from "./admin/routes/AdminRoutes";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>

      {/* PREMIÈRE PAGE : CONNEXION */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* CONNEXION */}

      {/* CONNEXION VISITEUR */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* SITE VISITEUR APRÈS CONNEXION */}
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

