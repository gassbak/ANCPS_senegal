import { useState } from "react";

const roles = ["Super administrateur", "Administrateur éditorial", "Vérificateur", "Établissement / institution", "Visiteur"];

const users = [
  { id: 1, name: "Administrateur", email: "admin@ancps.sn", role: "Super administrateur", actif: true },
  { id: 2, name: "A. Diop", email: "a.diop@ancps.sn", role: "Vérificateur", actif: true },
  { id: 3, name: "Bakeli School", email: "contact@bakeli.tech", role: "Établissement / institution", actif: true },
  { id: 4, name: "M. Fall", email: "m.fall@ancps.sn", role: "Administrateur éditorial", actif: false },
];

function Utilisateurs() {
  const [data, setData] = useState(users);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs & rôles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion des comptes et des droits par rôle : Super admin, Admin éditorial, Vérificateur, Établissement, Visiteur (§4.1).
          </p>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          + Inviter un utilisateur
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Utilisateur</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Rôle</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{u.name}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-5 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => setData(data.map((x) => (x.id === u.id ? { ...x, role: e.target.value } : x)))}
                    className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    {roles.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${u.actif ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.actif ? "Actif" : "Désactivé"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setData(data.map((x) => (x.id === u.id ? { ...x, actif: !x.actif } : x)))}
                    className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {u.actif ? "Désactiver" : "Réactiver"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Utilisateurs;