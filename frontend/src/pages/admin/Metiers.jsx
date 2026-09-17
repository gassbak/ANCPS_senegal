import { useState } from "react";

const metiers = [
  { id: 1, name: "Développeur Web", secteur: "Numérique", niveau: "BTS / Licence", certs: 5, competences: 12 },
  { id: 2, name: "Géomaticien", secteur: "Géographie / SIG", niveau: "Licence", certs: 2, competences: 8 },
  { id: 3, name: "Gestionnaire RH", secteur: "Gestion", niveau: "Licence / Master", certs: 3, competences: 9 },
];

function Metiers() {
  const [search, setSearch] = useState("");
  const filtered = metiers.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Métiers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Missions, compétences associées et certifications d'accès (§9.1).
          </p>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          + Ajouter un métier
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un métier..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Métier</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Secteur</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Niveau habituel</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Compétences</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Certifications liées</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{m.name}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{m.secteur}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{m.niveau}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{m.competences}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{m.certs}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="rounded-md px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50">Voir</button>
                    <button className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Modifier</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Metiers;