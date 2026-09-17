import { useState } from "react";

const organismes = [
  { id: 1, name: "Cisco Systems", type: "Certificateur privé international", certs: 6, site: "cisco.com" },
  { id: 2, name: "Ministère de la Formation professionnelle", type: "Autorité publique", certs: 34, site: "formation.gouv.sn" },
  { id: 3, name: "Bakeli School of Technology", type: "Organisme de formation agréé", certs: 8, site: "bakeli.tech" },
];

function Organismes() {
  const [search, setSearch] = useState("");
  const filtered = organismes.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organismes certificateurs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Nom, sigle, type, documents officiels et certifications délivrées (§9.2).
          </p>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          + Ajouter un organisme
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un organisme..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-lg font-bold text-teal-700">
                {o.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{o.name}</p>
                <p className="truncate text-xs text-gray-500">{o.type}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
              <span>{o.certs} certification(s)</span>
              <span>{o.site}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-md border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Voir la fiche</button>
              <button className="flex-1 rounded-md border border-gray-200 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50">Documents</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Organismes;