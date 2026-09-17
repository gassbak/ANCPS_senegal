import { useState } from "react";

const regions = [
  { id: 1, name: "Dakar", departements: ["Dakar", "Pikine", "Guédiawaye", "Rufisque"], etablissements: 120 },
  { id: 2, name: "Thiès", departements: ["Thiès", "Mbour", "Tivaouane"], etablissements: 34 },
  { id: 3, name: "Saint-Louis", departements: ["Saint-Louis", "Podor", "Dagana"], etablissements: 18 },
];

function Regions() {
  const [search, setSearch] = useState("");
  const filtered = regions.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Régions & Villes</h1>
          <p className="mt-1 text-sm text-gray-500">Référentiel géographique utilisé pour les filtres de recherche (§6.2, §13.1).</p>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          + Ajouter une région
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une région..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{r.name}</p>
            <p className="mt-1 text-xs text-gray-500">{r.etablissements} établissement(s)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.departements.map((d) => (
                <span key={d} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Regions;