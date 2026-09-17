const logs = [
  { id: 1, user: "A. Diop (Vérificateur)", action: "Changement de statut", entite: "Licence Géographie", ancienne: "En cours de vérification", nouvelle: "Vérifiée", date: "14/09/2026 09:12", ip: "196.1.xxx.xxx" },
  { id: 2, user: "Administrateur", action: "Publication", entite: "Développement Web", ancienne: "Brouillon", nouvelle: "Publié", date: "13/09/2026 16:40", ip: "196.1.xxx.xxx" },
  { id: 3, user: "Bakeli School (Établissement)", action: "Soumission de correction", entite: "Certification Full Stack", ancienne: "-", nouvelle: "Demande créée", date: "12/09/2026 11:05", ip: "41.82.xxx.xxx" },
  { id: 4, user: "Administrateur", action: "Suppression de document", entite: "Comptabilité", ancienne: "Décision n°221", nouvelle: "-", date: "10/09/2026 08:22", ip: "196.1.xxx.xxx" },
];

function Historique() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique / Audit</h1>
        <p className="mt-1 text-sm text-gray-500">
          Journalisation obligatoire des opérations sensibles : utilisateur, action, ancienne/nouvelle valeur, date/heure, IP (§12.2).
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Utilisateur</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Entité</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Ancienne valeur</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Nouvelle valeur</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-700">{l.user}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{l.action}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{l.entite}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{l.ancienne}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{l.nouvelle}</td>
                  <td className="px-5 py-4 text-xs text-gray-400">{l.date}<br />{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Historique;