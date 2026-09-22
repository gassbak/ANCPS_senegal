import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { loadStore } from "../services/adminStore";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

// Coquille commune à toutes les pages du back-office :
// sidebar + header + zone de contenu (Outlet des routes admin).
export default function AdminLayout({ session, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [store, setStore] = useState(loadStore());

  // Se resynchronise si une autre partie de l'app signale un
  // changement du store de démonstration.
  useEffect(() => {
    const refresh = () => setStore(loadStore());

    window.addEventListener("ancps-store-change", refresh);
    return () => window.removeEventListener("ancps-store-change", refresh);
  }, []);

  const unreadCount = store.notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar
        session={session}
        unreadCount={unreadCount}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="lg:pl-72">
        <AdminHeader session={session} unreadCount={unreadCount} onOpenSidebar={() => setSidebarOpen(true)} />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
