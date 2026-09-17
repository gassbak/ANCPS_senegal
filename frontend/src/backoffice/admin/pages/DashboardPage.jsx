
import React from "react";
import {
  Award,
  School,
  Clock3,
  FileWarning,
  Search,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { loadStore } from "../services/adminData";
import {
  StatCard,
  Badge,
  PageHeader,
  Table,
} from "../components/AdminUI";

export default function DashboardPage() {
  const s = loadStore() || {};

  // Valeurs par défaut pour éviter les erreurs si les données sont absentes
  const cert = Array.isArray(s.certifications) ? s.certifications : [];
  const requests = Array.isArray(s.requests) ? s.requests : [];
  const establishments = Array.isArray(s.establishments)
    ? s.establishments
    : [];
  const organizations = Array.isArray(s.organizations)
    ? s.organizations
    : [];
  const documents = Array.isArray(s.documents) ? s.documents : [];
  const audit = Array.isArray(s.audit) ? s.audit : [];

  const analytics = s.analytics || {
    searches: 0,
    visits: 0,
    views: 0,
    noResults: 0,
  };

  // Statistiques
  const published = cert.filter(
    (x) => x.published && !x.archived
  ).length;

  const pending = cert.filter(
    (x) =>
      x.status === "En cours de vérification" ||
      x.status === "Déclarée par l'organisme"
  ).length;

  const expired = cert.filter(
    (x) => x.status === "Expirée"
  ).length;

  // Échéances de reconnaissance à venir (J-180 / J-90 / J-30), d'après la dernière décision de chaque certification
  const today = new Date();

  const upcoming = cert
    .map((c) => ({ ...c, _latest: (c.decisions || [])[0] }))
    .filter((c) => c._latest?.validTo && c.status !== "Expirée" && c.status !== "Archivée")
    .map((c) => {
      const days = Math.round(
        (new Date(c._latest.validTo) - today) / (1000 * 60 * 60 * 24)
      );

      return { ...c, days, validTo: c._latest.validTo };
    })
    .filter((c) => c.days <= 180)
    .sort((a, b) => a.days - b.days);

  const alertTone = (days) =>
    days < 0 ? "red" : days <= 30 ? "red" : days <= 90 ? "yellow" : "blue";

  const alertLabel = (days) =>
    days < 0
      ? "Échéance dépassée"
      : days <= 30
      ? `J-${days}`
      : days <= 90
      ? `J-${days} (≤ 90j)`
      : `J-${days} (≤ 180j)`;

  // Complétude d'une certification
  const completeness = (c) => {
    const fields = [
      "title",
      "type",
      "organizationId",
      "domain",
      "level",
      "verificationStatus",
      "decisions",
      "documents",
    ];

    const present = fields.filter((key) => {
      if (key === "documents") {
        return documents.some(
          (d) => d.certificationId === c.id
        );
      }

      if (key === "decisions") {
        return (c.decisions || []).length > 0;
      }

      return Boolean(c[key]);
    }).length;

    return Math.round((present / fields.length) * 100);
  };

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue opérationnelle du référentiel, de la qualité et des demandes."
      />

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Certifications publiées"
          value={published}
          icon={Award}
          tone="emerald"
          detail={`${cert.length} au total`}
        />

        <StatCard
          label="En attente / vérification"
          value={pending}
          icon={Clock3}
          tone="yellow"
          detail={`${requests.filter(
            (r) => r.status === "À vérifier"
          ).length} demandes`}
        />

        <StatCard
          label="Certifications expirées"
          value={expired}
          icon={FileWarning}
          tone="red"
          detail="À traiter"
        />

        <StatCard
          label="Établissements"
          value={establishments.length}
          icon={School}
          tone="blue"
          detail={`${organizations.length} organismes`}
        />
      </div>

      {/* ACTIVITÉ + QUALITÉ */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Activité récente</h2>
              <p className="text-sm text-gray-500">
                Dernières opérations enregistrées.
              </p>
            </div>

            <TrendingUp className="text-emerald-600" />
          </div>

          <Table headers={["Action", "Entité", "Utilisateur", "Date"]}>
            {audit.slice(0, 6).map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-4 font-semibold">
                  {a.action}
                </td>

                <td className="px-5 py-4">
                  {a.entity}
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {a.user}
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {a.date}
                </td>
              </tr>
            ))}
          </Table>

          {audit.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              Aucune activité récente.
            </p>
          )}
        </div>

        {/* QUALITÉ */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">Qualité des fiches</h2>

          <p className="mb-5 text-sm text-gray-500">
            Score interne de complétude.
          </p>

          <div className="space-y-4">
            {cert.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="truncate pr-3">
                    {c.title || "Certification sans titre"}
                  </span>

                  <b>{completeness(c)}%</b>
                </div>

                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{
                      width: `${completeness(c)}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {cert.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                Aucune certification disponible.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ÉCHÉANCES */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-bold">Échéances de reconnaissance</h2>

        <p className="mb-4 text-sm text-gray-500">
          Accréditations et habilitations arrivant à échéance (alertes J-180 / J-90 / J-30).
        </p>

        {upcoming.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            Aucune échéance dans les 180 prochains jours.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-gray-500">
                    {c.organizationName} · Validité : {c.validTo}
                  </p>
                </div>

                <Badge tone={alertTone(c.days)}>{alertLabel(c.days)}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* À VÉRIFIER + ANALYTICS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* À VÉRIFIER */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">À vérifier</h2>

          <div className="mt-4 space-y-3">
            {requests
              .filter((r) => r.status === "À vérifier")
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {r.entity}
                    </p>

                    <p className="text-xs text-gray-500">
                      {r.requester} · {r.type}
                    </p>
                  </div>

                  <Badge
                    tone={
                      r.priority === "Haute"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {r.priority}
                  </Badge>
                </div>
              ))}

            {requests.filter(
              (r) => r.status === "À vérifier"
            ).length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                Aucune demande à vérifier.
              </p>
            )}
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">Analytics</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Recherches */}
            <div className="rounded-xl bg-gray-50 p-4">
              <Search className="text-emerald-700" size={17} />

              <p className="mt-2 text-2xl font-bold">
                {analytics.searches ?? 0}
              </p>

              <p className="text-xs text-gray-500">
                Recherches
              </p>
            </div>

            {/* Visites */}
            <div className="rounded-xl bg-gray-50 p-4">
              <TrendingUp
                className="text-blue-700"
                size={17}
              />

              <p className="mt-2 text-2xl font-bold">
                {analytics.visits ?? 0}
              </p>

              <p className="text-xs text-gray-500">
                Visites
              </p>
            </div>

            {/* Fiches consultées */}
            <div className="rounded-xl bg-gray-50 p-4">
              <CheckCircle2
                className="text-emerald-700"
                size={17}
              />

              <p className="mt-2 text-2xl font-bold">
                {analytics.views ?? 0}
              </p>

              <p className="text-xs text-gray-500">
                Fiches consultées
              </p>
            </div>

            {/* Sans résultat */}
            <div className="rounded-xl bg-gray-50 p-4">
              <AlertTriangle
                className="text-yellow-700"
                size={17}
              />

              <p className="mt-2 text-2xl font-bold">
                {analytics.noResults ?? 0}
              </p>

              <p className="text-xs text-gray-500">
                Recherches sans résultat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
