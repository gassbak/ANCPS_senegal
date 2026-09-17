import React, { useState } from "react";
import { Check, X, FileText } from "lucide-react";
import { loadStore, saveStore, can } from "../services/adminData";
import {
  PageHeader,
  SearchBar,
  Table,
  Badge,
  Button,
  Modal,
  Input,
  Select,
  Textarea,
  statusTone,
  EmptyState,
} from "../components/AdminUI";

// DEMANDES
export function RequestsPage({ session }) {
  const [s, setS] = useState(loadStore() || {});
  const [q, setQ] = useState("");
  const [view, setView] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const [form, setForm] = useState({ type: "Nouvelle certification", entity: "", note: "" });

  const requests = s.requests || [];

  const submitRequest = () => {
    const req = {
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
      ...s,
      requests: [req, ...requests],
      audit: [
        {
          id: "a_" + Date.now(),
          user: session.name,
          action: "Soumission",
          entity: req.entity,
          oldValue: "—",
          newValue: "À vérifier",
          date: new Date().toLocaleString("fr-FR"),
        },
        ...(s.audit || []),
      ],
    };

    saveStore(next);
    setS(next);
    setNewModal(false);
    setForm({ type: "Nouvelle certification", entity: "", note: "" });
  };

  const list = requests.filter((r) =>
    `${r.entity} ${r.requester} ${r.type}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const act = (r, status) => {
    const next = {
      ...s,
      requests: requests.map((x) =>
        x.id === r.id ? { ...x, status } : x
      ),
      notifications: [
        {
          id: "n_" + Date.now(),
          title: `Demande ${status.toLowerCase()}`,
          text: r.entity,
          type: "workflow",
          read: false,
          date: new Date().toISOString().slice(0, 10),
        },
        ...(s.notifications || []),
      ],
      audit: [
        {
          id: "a_" + Date.now(),
          user: session.name,
          action: "Workflow",
          entity: r.entity,
          oldValue: r.status,
          newValue: status,
          date: new Date().toLocaleString("fr-FR"),
        },
        ...(s.audit || []),
      ],
    };

    saveStore(next);
    setS(next);
    setView(null);
  };

  return (
    <div>
      <PageHeader
        title="Demandes à vérifier"
        description="Contributions externes : accepter, demander un complément ou rejeter."
        action={
          can(session.role, "requests.create") && (
            <Button onClick={() => setNewModal(true)}>Nouvelle demande</Button>
          )
        }
      />

      <div className="mb-5">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Rechercher une demande..."
        />
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <Table
          headers={[
            "Demande",
            "Demandeur",
            "Date",
            "Priorité",
            "Statut",
            "Action",
          ]}
        >
          {list.map((r) => (
            <tr key={r.id}>
              <td className="px-5 py-4">
                <button
                  onClick={() => setView(r)}
                  className="text-left font-bold hover:text-emerald-700"
                >
                  {r.entity}
                  <p className="text-xs font-normal text-gray-500">
                    {r.type}
                  </p>
                </button>
              </td>

              <td className="px-5 py-4">{r.requester}</td>
              <td className="px-5 py-4 text-gray-500">{r.submittedAt}</td>

              <td className="px-5 py-4">
                <Badge tone={r.priority === "Haute" ? "red" : "gray"}>
                  {r.priority}
                </Badge>
              </td>

              <td className="px-5 py-4">
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setView(r)}
                    className="rounded-lg bg-emerald-50 p-2 text-emerald-700"
                  >
                    <Check size={17} />
                  </button>

                  <button
                    onClick={() => act(r, "Complément demandé")}
                    className="rounded-lg bg-yellow-50 p-2 text-yellow-700"
                  >
                    ?
                  </button>

                  <button
                    onClick={() => act(r, "Rejetée")}
                    className="rounded-lg bg-red-50 p-2 text-red-700"
                  >
                    <X size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title="Dossier de contribution"
        wide
      >
        {view && (
          <div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Entité</p>
                <p className="font-bold">{view.entity}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Demandeur</p>
                <p className="font-bold">{view.requester}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              {view.note || "Aucune note."}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => act(view, "Complément demandé")}
              >
                Demander un complément
              </Button>

              <Button
                variant="danger"
                onClick={() => act(view, "Rejetée")}
              >
                Rejeter
              </Button>

              <Button onClick={() => act(view, "Acceptée")}>
                Valider
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={newModal}
        onClose={() => setNewModal(false)}
        title="Nouvelle demande de contribution"
      >
        <div className="space-y-4">
          <Select
            label="Type de demande"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              "Nouvelle certification",
              "Mise à jour d'une fiche",
              "Nouvel établissement",
              "Document justificatif",
            ]}
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
            <Button variant="secondary" onClick={() => setNewModal(false)}>
              Annuler
            </Button>

            <Button disabled={!form.entity} onClick={submitRequest}>
              Soumettre
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// SOURCES
export function SourcesPage({ session }) {
  return (
    <SimpleQuality
      title="Sources"
      description="Sources vérifiables, autorités, références et dates."
      keyName="sources"
      columns={["name", "authority", "reference", "type", "date"]}
      session={session}
      type="source"
    />
  );
}

// DOCUMENTS
export function DocumentsPage({ session }) {
  return (
    <SimpleQuality
      title="Documents"
      description="Référentiels, décisions, programmes et pièces justificatives."
      keyName="documents"
      columns={["name", "type", "version", "uploadedAt", "status"]}
      session={session}
      type="document"
    />
  );
}

// SOURCES + DOCUMENTS
function SimpleQuality({
  title,
  description,
  keyName,
  columns,
  session,
  type,
}) {
  const [s, setS] = useState(loadStore() || {});
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const data = s[keyName] || [];
  const certifications = s.certifications || [];

  const list = data.filter((x) =>
    Object.values(x)
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const save = () => {
    const item = {
      ...form,
      id: form.id || `${type}_${Date.now()}`,
    };

    const next = {
      ...s,
      [keyName]: form.id
        ? data.map((x) => (x.id === form.id ? item : x))
        : [item, ...data],

      audit: [
        {
          id: "a_" + Date.now(),
          user: session.name,
          action: form.id ? "Modification" : "Ajout",
          entity: item.name,
          oldValue: "—",
          newValue: "Enregistré",
          date: new Date().toLocaleString("fr-FR"),
        },
        ...(s.audit || []),
      ],
    };

    saveStore(next);
    setS(next);
    setModal(false);
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          <Button
            icon={FileText}
            onClick={() => {
              setForm({});
              setModal(true);
            }}
          >
            Ajouter
          </Button>
        }
      />

      <div className="mb-5">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder={`Rechercher dans ${title.toLowerCase()}...`}
        />
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <Table
          headers={[
            ...columns.map((c) => c.replace(/([A-Z])/g, " $1")),
            "Certification liée",
            "Actions",
          ]}
        >
          {list.map((x) => (
            <tr key={x.id}>
              {columns.map((c) => (
                <td key={c} className="px-5 py-4 text-gray-600">
                  {c === "status" ? (
                    <Badge tone={statusTone(x[c])}>{x[c]}</Badge>
                  ) : (
                    x[c] || "—"
                  )}
                </td>
              ))}

              <td className="px-5 py-4 text-gray-500">
                {certifications.find((c) => c.id === x.certificationId)?.title || "—"}
              </td>

              <td className="px-5 py-4 text-right">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setForm(x);
                    setModal(true);
                  }}
                >
                  Modifier
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={`Ajouter ${type}`}
      >
        <div className="space-y-4">
          {columns.map((c) => (
            <Input
              key={c}
              label={c}
              value={form[c] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  [c]: e.target.value,
                })
              }
            />
          ))}

          <Select
            label="Certification liée"
            value={form.certificationId || ""}
            onChange={(e) => setForm({ ...form, certificationId: e.target.value })}
            options={[
              { value: "", label: "— Aucune —" },
              ...certifications.map((c) => ({ value: c.id, label: c.title })),
            ]}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setModal(false)}
            >
              Annuler
            </Button>

            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// AUDIT
export function AuditPage() {
  const s = loadStore() || {};
  const audit = s.audit || [];

  return (
    <div>
      <PageHeader
        title="Historique & audit"
        description="Journalisation des opérations sensibles."
      />

      {audit.length === 0 ? (
        <EmptyState title="Aucune opération" />
      ) : (
        <Table
          headers={[
            "Date",
            "Utilisateur",
            "Action",
            "Entité",
            "Ancienne valeur",
            "Nouvelle valeur",
          ]}
        >
          {audit.map((a) => (
            <tr key={a.id}>
              <td className="px-5 py-4 text-gray-500">{a.date}</td>
              <td className="px-5 py-4">{a.user}</td>
              <td className="px-5 py-4 font-semibold">{a.action}</td>
              <td className="px-5 py-4">{a.entity}</td>
              <td className="px-5 py-4 text-gray-500">
                {a.oldValue}
              </td>
              <td className="px-5 py-4 text-gray-700">
                {a.newValue}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}