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
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
              <div className="max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-900 font-extrabold text-yellow-400">A</div>
                <h1 className="text-2xl font-bold text-gray-900">ANCPS Sénégal</h1>
                <p className="mt-2 text-gray-600">Espace back-office.</p>
                <a href="/admin" className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Accéder au back-office</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
