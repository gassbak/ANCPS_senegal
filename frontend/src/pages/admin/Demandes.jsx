import { useState } from "react";

const initialDemandes = [
  { id: 1, entity: "Certification", name: "Développeur Full Stack", auteur: "Bakeli School", etape: "À vérifier", date: "14/09/2026" },
  { id: 2, entity: "Établissement", name: "Institut Sup. de Technologie", auteur: "IST", etape: "Analyse en cours", date: "13/09/2026" },
  { id: 3, entity: "Correction", name: "Licence Géographie — durée", auteur: "UCAD", etape: "Complément demandé", date: "10/09/2026" },
  { id: 4, entity: "Certification", name: "Data Analyst", auteur: "Simplon Sénégal", etape: "Validée", date: "08/09/2026" },
];

const etapeStyle = {
  "À vérifier": "bg-amber-50 text-amber-700",
  "Analyse en cours": "bg-blue-50 text-blue-700",
  "Complément demandé": "bg-orange-50 text-orange-700",
  "Validée": "bg-green-50 text-green-700",
  "Rejetée": "bg-red-50 text-red-700",
};

function Demandes() {
  const [demandes, setDemandes] = useState(initialDemandes);
  const [filter, setFilter] = useState("Toutes");

  const updateEtape = (id, etape) => {
    setDemandes(demandes.map((d) => (d.id === id ? { ...d, etape } : d)));
  };

  const filtered = demandes.filter((d) => filter === "Toutes" || d.etape === filter);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demandes de contribution</h1>
        <p className="mt-1 text-sm text-gray-500">
          Workflow : soumission → à vérifier → analyse → validation/complément/rejet → publication → historisation (§10).
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Toutes", "À vérifier", "Analyse en cours", "Complément demandé", "Validée", "Rejetée"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === f ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Objet</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Auteur</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Étape</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm text-gray-600">{d.entity}</td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{d.name}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{d.auteur}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${etapeStyle[d.etape]}`}>{d.etape}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{d.date}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateEtape(d.id, "Validée")} className="rounded-md px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50">Valider</button>
                    <button onClick={() => updateEtape(d.id, "Complément demandé")} className="rounded-md px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50">Compléter</button>
                    <button onClick={() => updateEtape(d.id, "Rejetée")} className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50">Rejeter</button>
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

export default Demandes;