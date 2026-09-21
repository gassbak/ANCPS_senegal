import { loadStore } from "../services/adminStore";
import { PageHeader, Table, EmptyState } from "../components/ui";

export default function AuditPage() {
  const audit = (loadStore() || {}).audit || [];

  return (
    <div>
      <PageHeader title="Historique & audit" description="Journalisation des opérations sensibles." />

      {audit.length === 0 ? (
        <EmptyState title="Aucune opération" />
      ) : (
        <Table headers={["Date", "Utilisateur", "Action", "Entité", "Ancienne valeur", "Nouvelle valeur"]}>
          {audit.map((a) => (
            <tr key={a.id}>
              <td className="px-5 py-4 text-gray-500">{a.date}</td>
              <td className="px-5 py-4">{a.user}</td>
              <td className="px-5 py-4 font-semibold">{a.action}</td>
              <td className="px-5 py-4">{a.entity}</td>
              <td className="px-5 py-4 text-gray-500">{a.oldValue}</td>
              <td className="px-5 py-4 text-gray-700">{a.newValue}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
