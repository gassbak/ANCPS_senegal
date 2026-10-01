import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Annuaire from "./pages/Annuaire";
import AdminRoutes from "./admin/routes/AdminRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CertificationDetail from "./pages/CertificationDetail";
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
<Route
    path="/annuaire"
    element={<Annuaire />}
    
/>
<Route
    path="/certification/:id"
    element={<CertificationDetail />}
/>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />

          <Route path="/admin/*" element={<AdminRoutes />} />

          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}