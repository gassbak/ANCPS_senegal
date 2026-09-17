import { useState } from "react";

const documents = [
  { id: 1, cert: "Développement Web", autorite: "Ministère de la Formation professionnelle", reference: "Arrêté n°2026-0451", debut: "01/01/2024", fin: "31/12/2027", statut: "Vérifiée" },
  { id: 2, cert: "Licence Géographie", autorite: "ANAQ-Sup", reference: "Accréditation n°112/2025", debut: "01/09/2025", fin: "31/08/2029", statut: "Vérifiée" },
  { id: 3, cert: "Maintenance Informatique", autorite: "ISET", reference: "Non transmis", debut: "-", fin: "-", statut: "Déclarée par l'organisme" },
];

const statutStyle = {
  "Vérifiée": "bg-green-50 text-green-700",
  "Déclarée par l'organisme": "bg-amber-50 text-amber-700",
  "En cours de vérification": "bg-blue-50 text-blue-700",
  "Expirée": "bg-red-50 text-red-700",
};

function Documents() {
  const [search, setSearch] = useState("");
  const filtered = documents.filter((d) => d.cert.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents & Sources</h1>
          <p className="mt-1 text-sm text-gray-500">
            Traçabilité : autorité, référence de décision, dates de validité, preuve documentaire (§5.1).
          </p>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          + Ajouter un document
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par certification..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Certification</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Autorité / Source</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Référence</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Validité</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Preuve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{d.cert}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{d.autorite}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{d.reference}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{d.debut} → {d.fin}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statutStyle[d.statut]}`}>{d.statut}</span>
                </td>
                <td className="px-5 py-4">
                  <button className="rounded-md px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50">Consulter le document</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Documents;