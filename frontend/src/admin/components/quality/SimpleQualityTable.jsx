import { useState } from "react";
import { FileText } from "lucide-react";
import { loadStore, saveStore } from "../../services/adminStore";
import { makeAuditEntry, withAuditEntry } from "../../utils/audit";
import { PageHeader, Button, SearchBar, Table, Badge, Modal, Input, Select, statusTone, EmptyState } from "../ui";

// Page générique pour les référentiels "Sources" et "Documents", qui
// partagent la même structure (liste filtrable + fiche liée à une
// certification). Voir SourcesPage.jsx et DocumentsPage.jsx.
export default function SimpleQualityTable({ title, description, storeKey, columns, session, itemType }) {
  const [store, setStore] = useState(loadStore() || {});
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});

  const data = store[storeKey] || [];
  const certifications = store.certifications || [];

  const list = data.filter((item) => Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase()));

  const openForm = (item) => {
    setForm(item || {});
    setModalOpen(true);
  };

  const save = () => {
    const item = { ...form, id: form.id || `${itemType}_${Date.now()}` };

    const next = {
      ...store,
      [storeKey]: form.id ? data.map((x) => (x.id === form.id ? item : x)) : [item, ...data],
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({
          user: session.name,
          action: form.id ? "Modification" : "Ajout",
          entity: item.name,
          newValue: "Enregistré",
        })
      ),
    };

    saveStore(next);
    setStore(next);
    setModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={<Button icon={FileText} onClick={() => openForm(null)}>Ajouter</Button>}
      />

      <div className="mb-5">
        <SearchBar value={query} onChange={setQuery} placeholder={`Rechercher dans ${title.toLowerCase()}...`} />
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <Table headers={[...columns.map((c) => c.replace(/([A-Z])/g, " $1")), "Certification liée", "Actions"]}>
          {list.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column} className="px-5 py-4 text-gray-600">
                  {column === "status" ? <Badge tone={statusTone(item[column])}>{item[column]}</Badge> : item[column] || "—"}
                </td>
              ))}

              <td className="px-5 py-4 text-gray-500">
                {certifications.find((c) => c.id === item.certificationId)?.title || "—"}
              </td>

              <td className="px-5 py-4 text-right">
                <Button variant="ghost" onClick={() => openForm(item)}>Modifier</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Ajouter ${itemType}`}>
        <div className="space-y-4">
          {columns.map((column) => (
            <Input
              key={column}
              label={column}
              value={form[column] || ""}
              onChange={(e) => setForm({ ...form, [column]: e.target.value })}
            />
          ))}

          <Select
            label="Certification liée"
            value={form.certificationId || ""}
            onChange={(e) => setForm({ ...form, certificationId: e.target.value })}
            options={[{ value: "", label: "— Aucune —" }, ...certifications.map((c) => ({ value: c.id, label: c.title }))]}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
