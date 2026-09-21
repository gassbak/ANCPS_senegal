import { useState } from "react";
import { Check, X } from "lucide-react";
import { loadStore, saveStore, can } from "../services/adminStore";
import { makeAuditEntry, withAuditEntry, makeNotificationId } from "../utils/audit";
import { PageHeader, SearchBar, Table, Badge, Button, Modal, Input, Select, Textarea, statusTone, EmptyState } from "../components/ui";

const EMPTY_REQUEST_FORM = { type: "Nouvelle certification", entity: "", note: "" };

export default function RequestsPage({ session }) {
  const [store, setStore] = useState(loadStore() || {});
  const [query, setQuery] = useState("");
  const [viewed, setViewed] = useState(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_REQUEST_FORM);

  const requests = store.requests || [];

  const list = requests.filter((r) =>
    `${r.entity} ${r.requester} ${r.type}`.toLowerCase().includes(query.toLowerCase())
  );

  const submitRequest = () => {
    const request = {
      id: "req_" + Date.now(),
      entity: form.entity,
      type: form.type,
      note: form.note,
      requester: session.name,
      submittedAt: new Date().toISOString().slice(0, 10),
      priority: "Normale",
      status: "À vérifier",
    };

    const next = {
      ...store,
      requests: [request, ...requests],
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({ user: session.name, action: "Soumission", entity: request.entity, newValue: "À vérifier" })
      ),
    };

    saveStore(next);
    setStore(next);
    setNewModalOpen(false);
    setForm(EMPTY_REQUEST_FORM);
  };

  // Fait avancer une demande dans le workflow (accepter / compléter / rejeter),
  // journalise le changement et notifie l'utilisateur concerné.
  const applyDecision = (request, status) => {
    const next = {
      ...store,
      requests: requests.map((x) => (x.id === request.id ? { ...x, status } : x)),
      notifications: [
        {
          id: makeNotificationId(),
          title: `Demande ${status.toLowerCase()}`,
          text: request.entity,
          type: "workflow",
          read: false,
          date: new Date().toISOString().slice(0, 10),
        },
        ...(store.notifications || []),
      ],
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({ user: session.name, action: "Workflow", entity: request.entity, oldValue: request.status, newValue: status })
      ),
    };

    saveStore(next);
    setStore(next);
    setViewed(null);
  };

  return (
    <div>
      <PageHeader
        title="Demandes à vérifier"
        description="Contributions externes : accepter, demander un complément ou rejeter."
        action={
          can(session.role, "requests.create") && (
            <Button onClick={() => setNewModalOpen(true)}>Nouvelle demande</Button>
          )
        }
      />

      <div className="mb-5">
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher une demande..." />
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <Table headers={["Demande", "Demandeur", "Date", "Priorité", "Statut", "Action"]}>
          {list.map((r) => (
            <tr key={r.id}>
              <td className="px-5 py-4">
                <button onClick={() => setViewed(r)} className="text-left font-bold hover:text-emerald-700">
                  {r.entity}
                  <p className="text-xs font-normal text-gray-500">{r.type}</p>
                </button>
              </td>
              <td className="px-5 py-4">{r.requester}</td>
              <td className="px-5 py-4 text-gray-500">{r.submittedAt}</td>
              <td className="px-5 py-4">
                <Badge tone={r.priority === "Haute" ? "red" : "gray"}>{r.priority}</Badge>
              </td>
              <td className="px-5 py-4">
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <button onClick={() => setViewed(r)} className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <Check size={17} />
                  </button>
                  <button onClick={() => applyDecision(r, "Complément demandé")} className="rounded-lg bg-yellow-50 p-2 text-yellow-700">
                    ?
                  </button>
                  <button onClick={() => applyDecision(r, "Rejetée")} className="rounded-lg bg-red-50 p-2 text-red-700">
                    <X size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={!!viewed} onClose={() => setViewed(null)} title="Dossier de contribution" wide>
        {viewed && (
          <div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Entité</p>
                <p className="font-bold">{viewed.entity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Demandeur</p>
                <p className="font-bold">{viewed.requester}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">{viewed.note || "Aucune note."}</div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => applyDecision(viewed, "Complément demandé")}>
                Demander un complément
              </Button>
              <Button variant="danger" onClick={() => applyDecision(viewed, "Rejetée")}>Rejeter</Button>
              <Button onClick={() => applyDecision(viewed, "Acceptée")}>Valider</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={newModalOpen} onClose={() => setNewModalOpen(false)} title="Nouvelle demande de contribution">
        <div className="space-y-4">
          <Select
            label="Type de demande"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={["Nouvelle certification", "Mise à jour d'une fiche", "Nouvel établissement", "Document justificatif"]}
          />

          <Input
            label="Entité concernée *"
            placeholder="Ex : BTS Informatique de gestion"
            value={form.entity}
            onChange={(e) => setForm({ ...form, entity: e.target.value })}
          />

          <Textarea
            label="Note / justificatifs"
            rows={4}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setNewModalOpen(false)}>Annuler</Button>
            <Button disabled={!form.entity} onClick={submitRequest}>Soumettre</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
