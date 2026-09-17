const alertes = [
  { id: 1, type: "Échéance", message: "Accréditation Licence Géographie expire dans 30 jours", niveau: "J-30", date: "14/09/2026" },
  { id: 2, type: "Échéance", message: "Habilitation Institut Sup. Technologie expire dans 90 jours", niveau: "J-90", date: "14/09/2026" },
  { id: 3, type: "Document manquant", message: "Aucun justificatif transmis pour Maintenance Informatique", niveau: "Info", date: "12/09/2026" },
  { id: 4, type: "Contribution", message: "Nouvelle demande de correction reçue de l'UCAD", niveau: "Info", date: "10/09/2026" },
];

const niveauStyle = {
  "J-30": "bg-red-50 text-red-700",
  "J-90": "bg-amber-50 text-amber-700",
  "J-180": "bg-blue-50 text-blue-700",
  "Info": "bg-gray-100 text-gray-600",
};

function Alertes() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertes & échéances</h1>
        <p className="mt-1 text-sm text-gray-500">
          Notifications automatiques J-180 / J-90 / J-30 avant expiration d'une reconnaissance (§12.1).
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {alertes.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{a.message}</p>
                <p className="mt-1 text-xs text-gray-500">{a.type} · {a.date}</p>
              </div>
              <span className={`ml-4 inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${niveauStyle[a.niveau]}`}>
                {a.niveau}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Alertes;