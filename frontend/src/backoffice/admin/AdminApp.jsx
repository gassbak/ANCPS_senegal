import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import DashboardPage from "./pages/DashboardPage";
import CertificationsPage from "./pages/CertificationsPage";
import ReferencePages from "./pages/ReferencePages";
import ImportPage from "./pages/ImportPage";

import {
  RequestsPage,
  SourcesPage,
  DocumentsPage,
  AuditPage,
} from "./pages/QualityPages";

import {
  NotificationsPage,
  UsersPage,
  SettingsPage,
} from "./pages/NotificationsUsersSettings";

import { can } from "./services/adminData";

export default function AdminApp({ session, onLogout }) {
  const Gate = ({ permission, children }) => {
    if (!can(session.role, permission)) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-900">
            Accès non autorisé
          </h2>

          <p className="mt-2 text-sm text-red-700">
            Votre rôle ne dispose pas de la permission nécessaire pour cette
            section.
          </p>
        </div>
      );
    }

    return children;
  };

  return (
    <Routes>
      {/* LAYOUT ADMIN */}
      <Route
        element={
          <AdminLayout
            session={session}
            onLogout={onLogout}
          />
        }
      >
        {/* Tableau de bord */}
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        {/* CERTIFICATIONS */}
        <Route
          path="certifications"
          element={
            <Gate permission="content.read">
              <CertificationsPage session={session} />
            </Gate>
          }
        />

        {/* RÉFÉRENTIEL */}
        <Route
          path="organizations"
          element={
            <Gate permission="content.read">
              <ReferencePages
                type="organizations"
                session={session}
              />
            </Gate>
          }
        />

        <Route
          path="establishments"
          element={
            <Gate permission="content.read">
              <ReferencePages
                type="establishments"
                session={session}
              />
            </Gate>
          }
        />

        <Route
          path="jobs"
          element={
            <Gate permission="content.read">
              <ReferencePages
                type="jobs"
                session={session}
              />
            </Gate>
          }
        />

        <Route
          path="skills"
          element={
            <Gate permission="content.read">
              <ReferencePages
                type="skills"
                session={session}
              />
            </Gate>
          }
        />

        {/* QUALITÉ & DONNÉES */}
        <Route
          path="sources"
          element={
            <Gate permission="content.read">
              <SourcesPage session={session} />
            </Gate>
          }
        />

        <Route
          path="documents"
          element={
            <Gate permission="content.read">
              <DocumentsPage session={session} />
            </Gate>
          }
        />

        <Route
          path="requests"
          element={
            <Gate permission="requests.read">
              <RequestsPage session={session} />
            </Gate>
          }
        />

        <Route
          path="imports"
          element={
            <Gate permission="imports">
              <ImportPage session={session} />
            </Gate>
          }
        />

        <Route
          path="audit"
          element={
            <Gate permission="audit.read">
              <AuditPage />
            </Gate>
          }
        />

        {/* ADMINISTRATION */}
        <Route
          path="notifications"
          element={<NotificationsPage />}
        />

        <Route
          path="users"
          element={
            <Gate permission="admin.users">
              <UsersPage session={session} />
            </Gate>
          }
        />

        <Route
          path="settings"
          element={
            <Gate permission="admin.settings">
              <SettingsPage />
            </Gate>
          }
        />

        {/* URL inconnue */}
        <Route
          path="*"
          element={<Navigate to="dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}