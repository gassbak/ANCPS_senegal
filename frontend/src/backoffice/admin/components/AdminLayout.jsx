import React, { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Award,
  Building2,
  School,
  BriefcaseBusiness,
  BrainCircuit,
  Database,
  FileText,
  Upload,
  ClipboardCheck,
  Bell,
  History,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import {
  loadStore,
  can,
} from "../services/adminData";


/* =========================================================
   MENU DU BACK-OFFICE
========================================================= */

const groups = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        key: "dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        permission: "dashboard.read",
      },
    ],
  },

  {
    title: "Référentiel",
    items: [
      {
        key: "certifications",
        label: "Certifications",
        icon: Award,
        permission: "content.read",
      },
      {
        key: "organizations",
        label: "Organismes certificateurs",
        icon: Building2,
        permission: "content.read",
      },
      {
        key: "establishments",
        label: "Établissements",
        icon: School,
        permission: "content.read",
      },
      {
        key: "jobs",
        label: "Métiers",
        icon: BriefcaseBusiness,
        permission: "content.read",
      },
      {
        key: "skills",
        label: "Compétences",
        icon: BrainCircuit,
        permission: "content.read",
      },
    ],
  },

  {
    title: "Qualité & données",
    items: [
      {
        key: "sources",
        label: "Sources",
        icon: Database,
        permission: "sources.read",
      },
      {
        key: "documents",
        label: "Documents",
        icon: FileText,
        permission: "documents.read",
      },
      {
        key: "requests",
        label: "Demandes à vérifier",
        icon: ClipboardCheck,
        permission: "requests.read",
      },
      {
        key: "imports",
        label: "Import massif",
        icon: Upload,
        permission: "imports",
      },
      {
        key: "audit",
        label: "Historique & audit",
        icon: History,
        permission: "audit.read",
      },
    ],
  },

  {
    title: "Administration",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        icon: Bell,
        permission: "notifications.read",
      },
      {
        key: "users",
        label: "Utilisateurs",
        icon: Users,
        permission: "admin.users",
      },
      {
        key: "settings",
        label: "Paramétrage",
        icon: Settings,
        permission: "admin.settings",
      },
    ],
  },
];


/* =========================================================
   LAYOUT
========================================================= */

export default function AdminLayout({
  session,
  onLogout,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState(loadStore());

  const navigate = useNavigate();

  const role = session?.role;


  /* =======================================================
     ACTUALISATION DU STORE
  ======================================================= */

  useEffect(() => {
    const refresh = () => {
      setStore(loadStore());
    };

    window.addEventListener(
      "ancps-store-change",
      refresh
    );

    return () => {
      window.removeEventListener(
        "ancps-store-change",
        refresh
      );
    };
  }, []);


  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const unread =
    store.notifications?.filter(
      (notification) => !notification.read
    ).length || 0;


  /* =======================================================
     MENU AUTORISÉ POUR LE RÔLE
  ======================================================= */

  const visibleGroups = useMemo(() => {
    return groups
      .map((group) => ({
        ...group,

        items: group.items.filter(
          (item) =>
            can(role, item.permission)
        ),
      }))
      .filter(
        (group) => group.items.length > 0
      );
  }, [role]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =================================================
          SIDEBAR
      ================================================= */}

<aside
  className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col
    border-r border-emerald-950/20 bg-emerald-950 text-white
    transition-transform lg:translate-x-0
    ${open ? "translate-x-0" : "-translate-x-full"}`}
>

        {/* ===============================================
            HEADER SIDEBAR
        =============================================== */}

        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/10 px-5">

          <div className="flex items-center gap-2 font-extrabold tracking-wide">

            <div className="grid h-9 w-9 place-items-center rounded-lg bg-yellow-500 text-emerald-950">
              A
            </div>

            ANCPS

            <span className="text-xs font-normal text-emerald-200">
              BACK-OFFICE
            </span>

          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>

        </div>


        {/* ===============================================
            ROLE ACTUEL
        =============================================== */}

        <div className="flex-shrink-0 border-b border-white/10 px-4 py-3">

          <div className="rounded-xl bg-emerald-900/70 p-3">

            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Connecté en tant que
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {session?.name}
            </p>

            <p className="mt-0.5 text-xs text-emerald-200">
              {role}
            </p>

          </div>

        </div>


        {/* ===============================================
            NAVIGATION SCROLLABLE
        =============================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-4 pb-6">

          {visibleGroups.map(
            (group) => (
              <div
                key={group.title}
                className="mb-5"
              >

                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {group.title}
                </p>

                <nav className="space-y-1">

                  {group.items.map(
                    ({
                      key,
                      label,
                      icon: Icon,
                    }) => (

                      <NavLink
                        key={key}
                        to={`/admin/${key}`}
                        onClick={() =>
                          setOpen(false)
                        }
                        className={({
                          isActive,
                        }) =>
                          `
                          flex items-center gap-3
                          rounded-lg px-3 py-2.5
                          text-sm font-medium
                          transition

                          ${
                            isActive
                              ? "bg-white text-emerald-950 shadow"
                              : "text-emerald-50 hover:bg-emerald-900"
                          }
                          `
                        }
                      >

                        <Icon size={18} />

                        <span>
                          {label}
                        </span>

                        {key ===
                          "notifications" &&
                          unread > 0 && (
                            <span className="ml-auto rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-emerald-950">
                              {unread}
                            </span>
                          )}

                      </NavLink>

                    )
                  )}

                </nav>

              </div>
            )
          )}

        </div>


        {/* ===============================================
            LOGOUT
        =============================================== */}

        <div className="flex-shrink-0 border-t border-white/10 p-3">

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-emerald-900"
          >

            <LogOut size={18} />

            Se déconnecter

          </button>

        </div>

      </aside>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}


      {/* =================================================
          CONTENU PRINCIPAL
      ================================================= */}

      <div className="lg:pl-72">

        {/* HEADER */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu />
          </button>


          <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">

            <ShieldCheck
              size={17}
              className="text-emerald-700"
            />

            Gouvernance & qualité des données

          </div>


          <div className="ml-auto flex items-center gap-3">

            {/* Notifications */}

            <button
              onClick={() =>
                navigate(
                  "/admin/notifications"
                )
              }
              className="relative rounded-lg p-2 hover:bg-gray-100"
            >

              <Bell size={19} />

              {unread > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}

            </button>


            {/* Utilisateur */}

            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold">
                {session?.name}
              </p>

              <p className="text-xs text-gray-500">
                {role}
              </p>

            </div>


            <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800">

              {session?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </div>

          </div>

        </header>


        {/* PAGE */}

      <main>
        <Outlet />
      </main>

      </div>

    </div>
  );
}