import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { loadStore, saveStore } from "../services/adminStore";
import { makeAuditEntry, withAuditEntry } from "../utils/audit";
import {
  PageHeader,
  Button,
  SearchBar,
  Badge,
  Table,
  RowActions,
  Modal,
  Input,
  Select,
  Textarea,
  EmptyState,
} from "../components/ui";

// Configuration des 4 référentiels partageant la même page générique :
// organismes certificateurs, établissements, métiers, compétences.
const REFERENCE_CONFIGS = {
  organizations: {
    title: "Organismes certificateurs",
    desc: "Organismes qui délivrent les certifications.",
    key: "organizations",
    name: "organisme",
    fields: [
      ["name", "Nom"],
      ["acronym", "Sigle"],
      ["type", "Type"],
      ["city", "Ville"],
      ["email", "Email"],
      ["website", "Site web"],
    ],
    types: ["Public", "Privé", "ONG"],
  },
  establishments: {
    title: "Établissements",
    desc: "Établissements qui préparent les certifications.",
    key: "establishments",
    name: "établissement",
    fields: [
      ["name", "Nom"],
      ["type", "Statut public / privé"],
      ["region", "Région"],
      ["city", "Ville"],
      ["address", "Adresse"],
      ["phone", "Téléphone"],
      ["email", "Email"],
      ["website", "Site web"],
    ],
    types: ["Public", "Privé"],
  },
  jobs: {
    title: "Métiers",
    desc: "Référentiel des métiers associés aux compétences et certifications.",
    key: "jobs",
    name: "métier",
    fields: [
      ["name", "Intitulé"],
      ["description", "Description"],
      ["level", "Niveau habituel"],
    ],
  },
  skills: {
    title: "Compétences",
    desc: "Référentiel des compétences associées aux métiers et certifications.",
    key: "skills",
    name: "compétence",
    fields: [
      ["name", "Nom"],
      ["category", "Catégorie"],
      ["description", "Description"],
    ],
  },
};

export default function ReferencePages({ type, session }) {
  const config = REFERENCE_CONFIGS[type];

  const [store, setStore] = useState(loadStore());
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});

  const data = useMemo(() => store[config.key] || [], [store, config.key]);
  const refresh = () => setStore(loadStore());

  const list = useMemo(
    () => data.filter((item) => Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())),
    [data, query]
  );

  const openForm = (item) => {
    setForm(
      item
        ? { ...item }
        : { id: undefined, name: "", type: config.types?.[0] || "", description: "", category: "Technique" }
    );
    setModalOpen(true);
  };

  const save = () => {
    const item = { ...form, id: form.id || `${type.slice(0, -1)}_${Date.now()}`, status: form.status || "Actif" };

    const next = {
      ...store,
      [config.key]: form.id ? data.map((x) => (x.id === form.id ? item : x)) : [item, ...data],
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({
          user: session.name,
          action: form.id ? "Modification" : "Création",
          entity: item.name,
          newValue: "Enregistré",
        })
      ),
    };

    saveStore(next);
    setModalOpen(false);
    refresh();
  };

  const remove = (id) => {
    if (!confirm("Supprimer cet élément ?")) return;

    const next = {
      ...store,
      [config.key]: data.filter((x) => x.id !== id),
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({ user: session.name, action: "Suppression", entity: id, oldValue: "Présent", newValue: "Supprimé" })
      ),
    };

    saveStore(next);
    refresh();
  };

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.desc}
        action={<Button icon={Plus} onClick={() => openForm()}>Ajouter un {config.name}</Button>}
      />

      <div className="mb-5">
        <SearchBar value={query} onChange={setQuery} placeholder={`Rechercher un ${config.name}...`} />
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <Table headers={[config.fields[0][1], "Informations", "Statut", "Actions"]}>
          {list.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-4">
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.id}</p>
              </td>
              <td className="px-5 py-4 text-gray-600">
                {config.fields.slice(1, 4).map(([key, label]) => (
                  <div key={key} className="text-xs">
                    {label}: {item[key] || "—"}
                  </div>
                ))}
              </td>
              <td className="px-5 py-4">
                <Badge tone={item.status === "Actif" ? "green" : "yellow"}>{item.status || "Actif"}</Badge>
              </td>
              <td className="px-5 py-4">
                <RowActions onEdit={() => openForm(item)} onDelete={() => remove(item.id)} />
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? `Modifier ${config.name}` : `Nouveau ${config.name}`}>
        <div className="grid gap-4 md:grid-cols-2">
          {config.fields.map(([key, label]) => {
            if (key === "description") {
              return (
                <Textarea
                  key={key}
                  label={label}
                  className="md:col-span-2"
                  rows={4}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              );
            }

            if (key === "type" && config.types) {
              return (
                <Select
                  key={key}
                  label={label}
                  value={form[key] || config.types[0]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  options={config.types}
                />
              );
            }

            return (
              <Input
                key={key}
                label={label}
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button onClick={save}>Enregistrer</Button>
        </div>
      </Modal>
    </div>
  );
}
