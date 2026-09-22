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

import { loadStore } from "../services/adminStore";
import { StatCard, Badge, PageHeader, Table } from "../components/ui";

// Échéance de reconnaissance : couleur et libellé selon le nombre de jours restants.
function alertTone(days) {
  if (days < 0 || days <= 30) return "red";
  if (days <= 90) return "yellow";
  return "blue";
}

function alertLabel(days) {
  if (days < 0) return "Échéance dépassée";
  if (days <= 30) return `J-${days}`;
  if (days <= 90) return `J-${days} (≤ 90j)`;
  return `J-${days} (≤ 180j)`;
}

// Échéances de reconnaissance à venir (J-180 / J-90 / J-30), d'après la
// dernière décision de chaque certification.
function getUpcomingDeadlines(certifications) {
  const today = new Date();

  return certifications
    .map((c) => ({ ...c, _latest: (c.decisions || [])[0] }))
    .filter((c) => c._latest?.validTo && c.status !== "Expirée" && c.status !== "Archivée")
    .map((c) => {
      const days = Math.round((new Date(c._latest.validTo) - today) / (1000 * 60 * 60 * 24));
      return { ...c, days, validTo: c._latest.validTo };
    })
    .filter((c) => c.days <= 180)
    .sort((a, b) => a.days - b.days);
}

// Score interne de complétude d'une fiche certification.
function getCompleteness(certification, documents) {
  const fields = ["title", "type", "organizationId", "domain", "level", "verificationStatus", "decisions", "documents"];

  const present = fields.filter((key) => {
    if (key === "documents") return documents.some((d) => d.certificationId === certification.id);
    if (key === "decisions") return (certification.decisions || []).length > 0;
    return Boolean(certification[key]);
  }).length;

  return Math.round((present / fields.length) * 100);
}

export default function DashboardPage() {
  const s = loadStore() || {};

  const cert = Array.isArray(s.certifications) ? s.certifications : [];
  const requests = Array.isArray(s.requests) ? s.requests : [];
  const establishments = Array.isArray(s.establishments) ? s.establishments : [];
  const organizations = Array.isArray(s.organizations) ? s.organizations : [];
  const documents = Array.isArray(s.documents) ? s.documents : [];
  const audit = Array.isArray(s.audit) ? s.audit : [];
  const analytics = s.analytics || { searches: 0, visits: 0, views: 0, noResults: 0 };

  const published = cert.filter((x) => x.published && !x.archived).length;
  const pending = cert.filter((x) => x.status === "En cours de vérification" || x.status === "Déclarée par l'organisme").length;
  const expired = cert.filter((x) => x.status === "Expirée").length;
  const pendingRequests = requests.filter((r) => r.status === "À vérifier");
  const upcoming = getUpcomingDeadlines(cert);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue opérationnelle du référentiel, de la qualité et des demandes."
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Certifications publiées" value={published} icon={Award} tone="emerald" detail={`${cert.length} au total`} />
        <StatCard label="En attente / vérification" value={pending} icon={Clock3} tone="yellow" detail={`${pendingRequests.length} demandes`} />
        <StatCard label="Certifications expirées" value={expired} icon={FileWarning} tone="red" detail="À traiter" />
        <StatCard label="Établissements" value={establishments.length} icon={School} tone="blue" detail={`${organizations.length} organismes`} />
      </div>

      {/* Activité + qualité */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Activité récente</h2>
              <p className="text-sm text-gray-500">Dernières opérations enregistrées.</p>
            </div>
            <TrendingUp className="text-emerald-600" />
          </div>

          <Table headers={["Action", "Entité", "Utilisateur", "Date"]}>
            {audit.slice(0, 6).map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-4 font-semibold">{a.action}</td>
                <td className="px-5 py-4">{a.entity}</td>
                <td className="px-5 py-4 text-gray-500">{a.user}</td>
                <td className="px-5 py-4 text-gray-500">{a.date}</td>
              </tr>
            ))}
          </Table>

          {audit.length === 0 && <p className="py-8 text-center text-sm text-gray-500">Aucune activité récente.</p>}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">Qualité des fiches</h2>
          <p className="mb-5 text-sm text-gray-500">Score interne de complétude.</p>

          <div className="space-y-4">
            {cert.map((c) => {
              const completeness = getCompleteness(c, documents);

              return (
                <div key={c.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="truncate pr-3">{c.title || "Certification sans titre"}</span>
                    <b>{completeness}%</b>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${completeness}%` }} />
                  </div>
                </div>
              );
            })}

            {cert.length === 0 && <p className="py-6 text-center text-sm text-gray-500">Aucune certification disponible.</p>}
          </div>
        </div>
      </div>

      {/* Échéances */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-bold">Échéances de reconnaissance</h2>
        <p className="mb-4 text-sm text-gray-500">
          Accréditations et habilitations arrivant à échéance (alertes J-180 / J-90 / J-30).
        </p>

        {upcoming.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">Aucune échéance dans les 180 prochains jours.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.organizationName} · Validité : {c.validTo}</p>
                </div>
                <Badge tone={alertTone(c.days)}>{alertLabel(c.days)}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* À vérifier + analytics */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">À vérifier</h2>

          <div className="mt-4 space-y-3">
            {pendingRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold">{r.entity}</p>
                  <p className="text-xs text-gray-500">{r.requester} · {r.type}</p>
                </div>
                <Badge tone={r.priority === "Haute" ? "red" : "yellow"}>{r.priority}</Badge>
              </div>
            ))}

            {pendingRequests.length === 0 && <p className="py-6 text-center text-sm text-gray-500">Aucune demande à vérifier.</p>}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">Analytics</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <Search className="text-emerald-700" size={17} />
              <p className="mt-2 text-2xl font-bold">{analytics.searches ?? 0}</p>
              <p className="text-xs text-gray-500">Recherches</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <TrendingUp className="text-blue-700" size={17} />
              <p className="mt-2 text-2xl font-bold">{analytics.visits ?? 0}</p>
              <p className="text-xs text-gray-500">Visites</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <CheckCircle2 className="text-emerald-700" size={17} />
              <p className="mt-2 text-2xl font-bold">{analytics.views ?? 0}</p>
              <p className="text-xs text-gray-500">Fiches consultées</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <AlertTriangle className="text-yellow-700" size={17} />
              <p className="mt-2 text-2xl font-bold">{analytics.noResults ?? 0}</p>
              <p className="text-xs text-gray-500">Recherches sans résultat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
