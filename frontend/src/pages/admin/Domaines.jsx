import { useState } from "react";

const initialDomaines = [
  { id: 1, name: "Numérique et informatique", sousDomaines: ["Développement web", "Cybersécurité", "Data"], certs: 34 },
  { id: 2, name: "Agriculture, élevage et pêche", sousDomaines: ["Agroécologie", "Aquaculture"], certs: 6 },
  { id: 3, name: "Gestion et administration", sousDomaines: ["Comptabilité", "RH"], certs: 21 },
];

function Domaines() {
  const [domaines, setDomaines] = useState(initialDomaines);
  const [newDomaine, setNewDomaine] = useState("");

  const addDomaine = () => {
    if (!newDomaine.trim()) return;
    setDomaines([...domaines, { id: Date.now(), name: newDomaine, sousDomaines: [], certs: 0 }]);
    setNewDomaine("");
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Domaines</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nomenclature des 20 à 25 domaines et sous-domaines, administrable sans intervention technique (§6.1).
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={newDomaine}
            onChange={(e) => setNewDomaine(e.target.value)}
            placeholder="Nom du nouveau domaine..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <button onClick={addDomaine} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            + Ajouter
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {domaines.map((d) => (
          <div key={d.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{d.name}</p>
              <span className="text-xs text-gray-500">{d.certs} certification(s)</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {d.sousDomaines.map((s) => (
                <span key={s} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">{s}</span>
              ))}
              <button className="rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-teal-400 hover:text-teal-600">
                + Sous-domaine
              </button>
            </div>
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
              <button className="text-xs font-medium text-gray-600 hover:text-teal-600">Modifier</button>
              <button className="text-xs font-medium text-red-600 hover:text-red-700">Archiver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Domaines;