import { useState } from "react";
import { Save } from "lucide-react";
import { loadStore, saveStore } from "../services/adminStore";
import { PageHeader, Button, Textarea } from "../components/ui";

// Les nomenclatures administrables (une par ligne). La clé correspond au
// champ correspondant dans le store ; label/description sont affichés.
const SETTINGS_FIELDS = [
  ["domains", "Domaines", "Secteurs d'activité."],
  ["subdomains", "Sous-domaines", "Nomenclature des domaines."],
  ["certificationTypes", "Types de certification", "Types de certification."],
  ["levels", "Niveaux", "Niveaux d'entrée / sortie."],
  ["verificationStatuses", "Statuts", "Statuts de vérification."],
  ["natures", "Natures", "Nature des certifications."],
  ["modalities", "Modalités", "Présentiel, distance, hybride."],
  ["regions", "Régions", "Référentiel territorial."],
  ["recognitionTypes", "Types de reconnaissance", "Reconnaissance et accréditation."],
  ["authorities", "Autorités", "Organismes de référence."],
];

export default function SettingsPage() {
  const [store, setStore] = useState(loadStore() || {});

  const [values, setValues] = useState(() =>
    Object.fromEntries(SETTINGS_FIELDS.map(([key]) => [key, (store[key] || []).join("\n")]))
  );

  const save = () => {
    const next = { ...store };

    Object.entries(values).forEach(([key, value]) => {
      next[key] = value.split("\n").map((x) => x.trim()).filter(Boolean);
    });

    saveStore(next);
    setStore(next);
    alert("Paramètres enregistrés");
  };

  return (
    <div>
      <PageHeader title="Paramétrage" description="Nomenclatures administrables sans intervention technique." />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {SETTINGS_FIELDS.map(([key, title, description]) => (
          <div key={key} className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-xs text-gray-500">{description}</p>

            <Textarea
              className="mt-4"
              rows={7}
              value={values[key] || ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button icon={Save} onClick={save}>Enregistrer les paramètres</Button>
      </div>
    </div>
  );
}
