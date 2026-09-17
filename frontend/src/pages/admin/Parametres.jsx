function Parametres() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500">Sécurité, sauvegardes et règles éditoriales globales (§16, §24).</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Sécurité</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Authentification forte (2FA)</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Désactivée</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Politique de mot de passe</span>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Protection CSRF / anti-spam</span>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Active</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Sauvegardes</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Dernière sauvegarde</span>
              <span className="text-gray-900 font-medium">14/09/2026 03:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fréquence</span>
              <span className="text-gray-900 font-medium">Quotidienne</span>
            </div>
            <button className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50">
              Lancer une sauvegarde manuelle
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900">Comité éditorial et qualité (§24)</h2>
          <p className="mt-2 text-sm text-gray-600">
            Membres chargés de valider les nomenclatures, contrôler les sources et superviser les mises à jour.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Expert formation professionnelle", "Expert enseignement supérieur", "Ingénieur pédagogique", "Représentant employeurs", "Responsable data", "Responsable produit"].map((r) => (
              <span key={r} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parametres;