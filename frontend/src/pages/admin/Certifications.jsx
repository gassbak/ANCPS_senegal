import { useState } from "react";
import CertificationForm from "../../components/admin/CertificationForm";

const initialCertifications = [
  {
    id: 1,
    name: "Développement Web",
    code: "CERT-DW-001",
    organization: "Bakeli School of Technology",
    domain: "Informatique",
    status: "Publié",
    date: "14/09/2026",
  },
  {
    id: 2,
    name: "Licence Géographie",
    code: "CERT-GEO-002",
    organization: "Université Cheikh Anta Diop",
    domain: "Géographie",
    status: "Publié",
    date: "12/09/2026",
  },
  {
    id: 3,
    name: "Maintenance Informatique",
    code: "CERT-MI-003",
    organization: "Institut Supérieur de Technologie",
    domain: "Informatique",
    status: "À vérifier",
    date: "10/09/2026",
  },
  {
    id: 4,
    name: "Gestion des Ressources Humaines",
    code: "CERT-GRH-004",
    organization: "École Supérieure de Gestion",
    domain: "Gestion",
    status: "Brouillon",
    date: "08/09/2026",
  },
  {
    id: 5,
    name: "Comptabilité",
    code: "CERT-COM-005",
    organization: "Centre de Formation Professionnelle",
    domain: "Finance",
    status: "Archivé",
    date: "05/09/2026",
  },
];

function Certifications() {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [domainFilter, setDomainFilter] = useState("Tous");
  const [showForm, setShowForm] = useState(false);

  const filteredCertifications = certifications.filter((certification) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      certification.name.toLowerCase().includes(searchValue) ||
      certification.code.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "Tous" ||
      certification.status === statusFilter;

    const matchesDomain =
      domainFilter === "Tous" ||
      certification.domain === domainFilter;

    return matchesSearch && matchesStatus && matchesDomain;
  });

const handleAddCertification = (newCertification) => {
  const certification = {
    ...newCertification,
    id: Date.now(),
    date: new Date().toLocaleDateString("fr-FR"),
  };

  setCertifications((previousCertifications) => [
    ...previousCertifications,
    certification,
  ]);
};

  return (
    <div>

      {/* En-tête */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gérer les certifications du référentiel ANCPS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          + Ajouter une certification
        </button>

      </div>

      {/* Recherche et filtres */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Recherche */}
          <div>
            <label
              htmlFor="search"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Rechercher
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom ou code..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Statut */}
          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Statut
            </label>

            <select
              id="status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Publié">Publié</option>
              <option value="À vérifier">À vérifier</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Archivé">Archivé</option>
            </select>
          </div>

          {/* Domaine */}
          <div>
            <label
              htmlFor="domain"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Domaine
            </label>

            <select
              id="domain"
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="Tous">Tous les domaines</option>
              <option value="Informatique">Informatique</option>
              <option value="Géographie">Géographie</option>
              <option value="Gestion">Gestion</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

        </div>

        {/* Résultats */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">

          <p className="text-sm text-gray-500">
            {filteredCertifications.length} certification(s) trouvée(s)
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("Tous");
              setDomainFilter("Tous");
            }}
            className="text-sm font-medium text-gray-500 hover:text-teal-600"
          >
            Réinitialiser les filtres
          </button>

        </div>

      </div>

      {/* Tableau */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Certification
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Organisme
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Domaine
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Statut
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredCertifications.map((certification) => (
                <tr
                  key={certification.id}
                  className="transition hover:bg-gray-50"
                >

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {certification.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {certification.code}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {certification.organization}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {certification.domain}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        certification.status === "Publié"
                          ? "bg-green-50 text-green-700"
                          : certification.status === "À vérifier"
                            ? "bg-amber-50 text-amber-700"
                            : certification.status === "Brouillon"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-50 text-red-700"
                      }`}
                    >
                      {certification.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {certification.date}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50"
                      >
                        Voir
                      </button>

                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                      >
                        Modifier
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

{showForm && (
  <CertificationForm
    onClose={() => setShowForm(false)}
    onSubmit={handleAddCertification}
  />
)}

    </div>
  );
}

export default Certifications;