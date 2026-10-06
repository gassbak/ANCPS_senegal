import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { AuthProvider, useAuth } from "./context/AuthContext";

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

      {/* Première page quand on lance le site */}
      <Route
        path="/"
        element={<Navigate to="/register" replace />}
      />
       


       <Route
  path="/mot-de-passe-oublie"
  element={<ForgotPassword />}
/>

<Route
  path="/reinitialiser-mot-de-passe"
  element={<ResetPassword />}
/>


      {/* INSCRIPTION VISITEUR */}
      <Route
        path="/register"
        element={<Register />}
      />

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

     

      {/* Toute autre URL */}
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

