import { useState } from "react";

const competences = [
  { id: 1, name: "Développement Front-end", domaine: "Numérique", type: "Spécifique" },
  { id: 2, name: "Analyse spatiale (SIG)", domaine: "Géographie", type: "Spécifique" },
  { id: 3, name: "Communication professionnelle", domaine: "Transversal", type: "Générale" },
];

function Competences() {
  const [search, setSearch] = useState("");
  const filtered = competences.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compétences</h1>
          <p className="mt-1 text-sm text-gray-500">
            Référentiel des ~1000 compétences générales et spécifiques (§6.2, §8.1).
          </p>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          + Ajouter une compétence
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une compétence..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Compétence</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Domaine</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{c.name}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{c.domaine}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{c.type}</span>
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
  );
}

export default Competences;