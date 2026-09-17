import { useMemo, useState } from "react";
import { loadStore, saveStore } from "../../admin/services/adminData";
import { Button, Input, Modal, PageHeader, SearchBar, Table } from "../../admin/components/AdminUI";

const initialSources = [
  { id: "source_1", name: "Référentiel ANCPS", type: "Référentiel", url: "" },
  { id: "source_2", name: "Document officiel", type: "Document", url: "" },
];

export default function Sources() {
  const [store, setStore] = useState(loadStore());
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Document", url: "" });
  const sources = store.sources?.length ? store.sources : initialSources;
  const filtered = useMemo(() => sources.filter((item) => `${item.name} ${item.type} ${item.url}`.toLowerCase().includes(query.toLowerCase())), [sources, query]);

  const save = () => {
    if (!form.name.trim()) return;
    const next = { ...form, id: `source_${Date.now()}` };
    saveStore({ ...store, sources: [next, ...sources] });
    setStore(loadStore());
    setForm({ name: "", type: "Document", url: "" });
    setModal(false);
  };

  return <div>
    <PageHeader title="Sources" description="Références utilisées pour documenter et vérifier les certifications." action={<Button  onClick={() => setModal(true)}>Ajouter une source</Button>} />
    <div className="mb-5 max-w-xl"><SearchBar value={query} onChange={setQuery} placeholder="Rechercher une source..." /></div>
    <Table headers={["Source", "Type", "Lien"]}>
      {filtered.map((source) => <tr key={source.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">📄</div><span className="font-semibold">{source.name}</span></div></td><td className="px-5 py-4 text-sm text-gray-600">{source.type}</td><td className="px-5 py-4 text-sm text-gray-600">{source.url || "—"}</td></tr>)}
    </Table>
    <Modal open={modal} onClose={() => setModal(false)} title="Ajouter une source">
      <div className="space-y-4"><Input label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /><Input label="URL (optionnelle)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setModal(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div></div>
    </Modal>
  </div>;
}
