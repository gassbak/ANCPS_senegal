import { useState } from "react";

const steps = ["Fichier", "Mapping des colonnes", "Prévisualisation", "Rapport"];

const mapping = [
  { source: "Diplôme", cible: "Certification" },
  { source: "Ecole", cible: "Établissement" },
  { source: "Filière", cible: "Domaine / sous-domaine" },
  { source: "Niveau", cible: "Niveau" },
  { source: "Durée", cible: "Durée" },
  { source: "Statut", cible: "Statut de vérification / reconnaissance" },
];

function Import() {
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState(null);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import massif</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mapping des colonnes, prévisualisation, détection de doublons, rapport d'erreurs (§11.3).
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              i <= step ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm ${i === step ? "font-semibold text-gray-900" : "text-gray-500"}`}>{s}</span>
            {i < steps.length - 1 && <div className="mx-3 h-px flex-1 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">
            <p className="text-sm text-gray-600">Glissez un fichier CSV ou Excel, ou cliquez pour parcourir.</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFileName(e.target.files[0]?.name)}
              className="mt-4 text-sm"
            />
            {fileName && <p className="mt-3 text-sm font-medium text-teal-700">Fichier sélectionné : {fileName}</p>}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-4 text-sm text-gray-600">Faites correspondre les colonnes du fichier source aux champs de la plateforme.</p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="py-2">Colonne du fichier</th>
                  <th className="py-2">Champ plateforme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mapping.map((m) => (
                  <tr key={m.source}>
                    <td className="py-2.5 text-gray-700">{m.source}</td>
                    <td className="py-2.5">
                      <select defaultValue={m.cible} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm">
                        <option>{m.cible}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">532 lignes</span> détectées — 
              <span className="font-semibold text-amber-600"> 14 doublons potentiels</span> à traiter avant import.
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
              Aperçu des 5 premières lignes du fichier normalisé (nom, organisme, domaine, niveau, durée, statut)...
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            <p className="text-green-700 font-medium">✔ 512 certifications importées avec succès.</p>
            <p className="text-amber-600 font-medium">⚠ 14 doublons ignorés (déjà présents dans le référentiel).</p>
            <p className="text-red-600 font-medium">✘ 6 lignes rejetées (champs obligatoires manquants) — rapport d'erreurs téléchargeable.</p>
          </div>
        )}

        <div className="mt-6 flex justify-between border-t border-gray-100 pt-4">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 disabled:opacity-40"
          >
            Précédent
          </button>
          <button
            disabled={step === steps.length - 1}
            onClick={() => setStep(step + 1)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-40"
          >
            {step === steps.length - 2 ? "Lancer l'import" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Import;