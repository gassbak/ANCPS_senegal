import { useMemo, useState } from "react";
import { loadStore, saveStore } from "../services/adminStore";
import { makeAuditEntry, withAuditEntry } from "../utils/audit";
import { EMPTY_CERTIFICATION, EMPTY_DECISION } from "../components/certifications/certificationDefaults";

const CERTIFICATION_STATUSES = [
  "Tous",
  "Publié",
  "Vérifiée",
  "Déclarée par l'organisme",
  "En cours de vérification",
  "Expirée",
  "Archivée",
];

// Encapsule tout l'état et la logique métier de la page Certifications :
// chargement du store, filtres, formulaire (création/édition/duplication),
// décisions, et actions (enregistrer, supprimer, archiver, publier).
export function useCertifications(session) {
  const [store, setStore] = useState(loadStore() || {});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_CERTIFICATION);
  const [newDecision, setNewDecision] = useState(EMPTY_DECISION);
  const [viewedCertification, setViewedCertification] = useState(null);

  const certifications = useMemo(() => store.certifications || [], [store.certifications]);
  const domains = store.domains || [];
  const levels = store.levels || [];
  const organizations = store.organizations || [];
  const establishments = store.establishments || [];
  const jobs = store.jobs || [];
  const skillsRef = store.skills || [];
  const sources = store.sources || [];

  const refresh = () => setStore(loadStore());

  const list = useMemo(() => {
    return certifications.filter((c) => {
      const matchesStatus =
        statusFilter === "Tous" || c.status === statusFilter || (statusFilter === "Publié" && c.published);

      const haystack = `${c.title} ${c.organizationName} ${c.domain} ${c.code}`.toLowerCase();
      return matchesStatus && haystack.includes(search.toLowerCase());
    });
  }, [certifications, search, statusFilter]);

  const openCreate = () => {
    setForm({ ...EMPTY_CERTIFICATION, id: undefined, organizationName: "" });
    setNewDecision(EMPTY_DECISION);
    setFormModalOpen(true);
  };

  const openEdit = (certification) => {
    setForm({
      ...EMPTY_CERTIFICATION,
      ...certification,
      objectives: (certification.objectives || []).join("\n"),
      skills: (certification.skills || []).join("\n"),
      establishmentIds: certification.establishmentIds || [],
      jobIds: certification.jobIds || [],
      skillIds: certification.skillIds || [],
      decisions: certification.decisions || [],
    });
    setNewDecision(EMPTY_DECISION);
    setFormModalOpen(true);
  };

  const openDuplicate = (certification) => {
    setForm({
      ...certification,
      id: undefined,
      title: certification.title + " — copie",
      code: certification.code + "-COPY",
      published: false,
      status: "En cours de vérification",
      decisions: [],
    });
    setNewDecision(EMPTY_DECISION);
    setFormModalOpen(true);
  };

  const addDecision = () => {
    if (!newDecision.authority && !newDecision.decisionRef) {
      alert("Renseignez au moins l'autorité ou la référence de la décision.");
      return;
    }

    setForm({
      ...form,
      decisions: [{ ...newDecision, id: "dec_" + Date.now() }, ...form.decisions],
      status: newDecision.status,
    });
    setNewDecision(EMPTY_DECISION);
  };

  const save = () => {
    const payload = {
      ...form,
      objectives: String(form.objectives || "").split("\n").map((x) => x.trim()).filter(Boolean),
      skills: String(form.skills || "").split("\n").map((x) => x.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const auditNewValue = form.decisions[0] ? `Décision : ${form.decisions[0].status}` : payload.published ? "Publié" : "Brouillon";

    const next = {
      ...store,
      certifications: form.id
        ? certifications.map((c) => (c.id === form.id ? payload : c))
        : [{ ...payload, id: "cert_" + Date.now(), createdAt: payload.updatedAt }, ...certifications],
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({ user: session.name, action: form.id ? "Modification" : "Création", entity: payload.title, newValue: auditNewValue })
      ),
    };

    saveStore(next);
    setStore(next);
    setFormModalOpen(false);
  };

  const remove = (id) => {
    if (!confirm("Supprimer cette certification ? Cette action est journalisée.")) return;

    const next = {
      ...store,
      certifications: certifications.filter((c) => c.id !== id),
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({ user: session.name, action: "Suppression", entity: id, oldValue: "Présente", newValue: "Supprimée" })
      ),
    };

    saveStore(next);
    refresh();
  };

  const archive = (certification) => {
    const next = {
      ...store,
      certifications: certifications.map((x) =>
        x.id === certification.id ? { ...x, archived: true, published: false, status: "Archivée" } : x
      ),
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({ user: session.name, action: "Archivage", entity: certification.title, oldValue: certification.status, newValue: "Archivée" })
      ),
    };

    saveStore(next);
    refresh();
  };

  const publish = (certification) => {
    const nowPublished = !certification.published;

    const next = {
      ...store,
      certifications: certifications.map((x) =>
        x.id === certification.id
          ? { ...x, published: nowPublished, archived: false, status: nowPublished ? "Vérifiée" : "En cours de vérification" }
          : x
      ),
      audit: withAuditEntry(
        store.audit,
        makeAuditEntry({
          user: session.name,
          action: nowPublished ? "Publication" : "Dépublication",
          entity: certification.title,
          oldValue: certification.published ? "Publié" : "Brouillon",
          newValue: nowPublished ? "Publié" : "Brouillon",
        })
      ),
    };

    saveStore(next);
    refresh();
  };

  return {
    // données de référence
    domains,
    levels,
    organizations,
    establishments,
    jobs,
    skillsRef,
    sources,
    // filtres
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statuses: CERTIFICATION_STATUSES,
    list,
    // formulaire
    form,
    setForm,
    newDecision,
    setNewDecision,
    formModalOpen,
    setFormModalOpen,
    openCreate,
    openEdit,
    openDuplicate,
    addDecision,
    save,
    // aperçu
    viewedCertification,
    setViewedCertification,
    // actions de ligne
    remove,
    archive,
    publish,
  };
}
