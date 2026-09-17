import { useState } from "react";

const etats = ["Vérifiée", "Déclarée par l'organisme", "En cours de vérification", "Expirée", "Archivée"];

const fiches = [
  { id: 1, name: "Développement Web", etat: "En cours de vérification", verificateur: "Non assigné" },
  { id: 2, name: "Licence Géographie", etat: "Vérifiée", verificateur: "A. Diop" },
  { id: 3, name: "Maintenance Informatique", etat: "Déclarée par l'organisme", verificateur: "Non assigné" },
];

const etatStyle = {
  "Vérifiée": "bg-green-50 text-green-700",
  "Déclarée par l'organisme": "bg-amber-50 text-amber-700",
  "En cours de vérification": "bg-blue-50 text-blue-700",
  "Expirée": "bg-red-50 text-red-700",
  "Archivée": "bg-gray-100 text-gray-600",
};

function Verification() {
  const [data, setData] = useState(fiches);

  const changeEtat = (id, etat) => setData(data.map((f) => (f.id === id ? { ...f, etat } : f)));

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vérification</h1>
        <p className="mt-1 text-sm text-gray-500">
          File de travail du vérificateur : contrôle des justificatifs et changement de statut (§4.1, §5.2).
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Fiche</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">État actuel</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Vérificateur assigné</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Changer l'état</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{f.name}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${etatStyle[f.etat]}`}>{f.etat}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{f.verificateur}</td>
                <td className="px-5 py-4">
                  <select
                    value={f.etat}
                    onChange={(e) => changeEtat(f.id, e.target.value)}
                    className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    {etats.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Verification;