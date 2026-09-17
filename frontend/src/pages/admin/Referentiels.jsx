import { useState } from "react";

const tabs = [
  { key: "types", label: "Types de certification", data: ["CAP", "BEP", "BT", "BTS", "Licence", "Master", "Certification professionnelle privée"] },
  { key: "niveaux", label: "Niveaux d'entrée / sortie", data: ["3ème", "Terminale/Bac", "Bac+2", "Bac+3", "Bac+5"] },
  { key: "statuts", label: "Statuts de vérification", data: ["Vérifiée", "Déclarée par l'organisme", "En cours de vérification", "Expirée", "Archivée"] },
  { key: "reconnaissance", label: "Types de reconnaissance", data: ["Reconnaissance d'État", "Accréditation", "Habilitation", "Non reconnue (privée)"] },
  { key: "autorites", label: "Autorités de référence", data: ["Ministère de la Formation professionnelle", "Ministère de l'Enseignement supérieur", "ANAQ-Sup"] },
];

function Referentiels() {
  const [active, setActive] = useState("types");
  const currentTab = tabs.find((t) => t.key === active);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Niveaux & Types</h1>
        <p className="mt-1 text-sm text-gray-500">
          Référentiels structurants configurables : types, niveaux, statuts, reconnaissance, autorités (§6.2).
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              active === t.key ? "border-teal-600 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">{currentTab.label}</p>
          <button className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700">+ Ajouter</button>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {currentTab.data.map((item) => (
            <div key={item} className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-700">{item}</span>
              <div className="flex gap-2">
                <button className="text-xs font-medium text-gray-500 hover:text-teal-600">Modifier</button>
                <button className="text-xs font-medium text-red-500 hover:text-red-600">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Referentiels;