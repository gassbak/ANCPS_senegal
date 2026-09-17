import { useState } from "react";

const etablissements = [
  { id: 1, name: "Bakeli School of Technology", type: "Privé", region: "Dakar", city: "Dakar", certs: 8, status: "Habilité" },
  { id: 2, name: "Université Cheikh Anta Diop", type: "Public", region: "Dakar", city: "Dakar", certs: 42, status: "Habilité" },
  { id: 3, name: "Institut Supérieur de Technologie", type: "Privé", region: "Thiès", city: "Thiès", certs: 5, status: "En cours" },
  { id: 4, name: "Centre de Formation Professionnelle", type: "Public", region: "Saint-Louis", city: "Saint-Louis", certs: 3, status: "Non renseigné" },
];

const statusStyle = {
  "Habilité": "bg-green-50 text-green-700",
  "En cours": "bg-amber-50 text-amber-700",
  "Non renseigné": "bg-gray-100 text-gray-600",
};

function Etablissements() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [regionFilter, setRegionFilter] = useState("Toutes");

  const filtered = etablissements.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "Tous" || e.type === typeFilter;
    const matchesRegion = regionFilter === "Toutes" || e.region === regionFilter;
    return matchesSearch && matchesType && matchesRegion;
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Établissements</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérer les établissements de formation et centres référencés (§9.3).
          </p>
        </div>
        <button type="button" className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          + Ajouter un établissement
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Rechercher</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom de l'établissement..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Statut public/privé</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
              <option value="Tous">Tous</option>
              <option value="Public">Public</option>
              <option value="Privé">Privé</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Région</label>
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
              <option value="Toutes">Toutes</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Établissement</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Région / Ville</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Certifications</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Habilitation</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <tr key={e.id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{e.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{e.type}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{e.region} · {e.city}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{e.certs} certification(s)</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
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
    </div>
  );
}

export default Etablissements;