import { request } from "../../services/api";

const json = (data) => JSON.stringify(data);
const day = (d) => (d ? String(d).slice(0, 10) : "");
const idOf = (v) => (v && typeof v === "object" ? v._id : v) || "";
const lines = (v) =>
  (Array.isArray(v) ? v : String(v || "").split("\n"))
    .map((x) => String(x).trim())
    .filter(Boolean);
const safeList = (path) => request(path).catch(() => []);

// Les créations de domaines / métiers / compétences renvoient { message, objet }
const unwrap = (res) =>
  res && res._id
    ? res
    : Object.values(res || {}).find((v) => v && typeof v === "object" && v._id);

export const DEFAULT_DOMAINS = [
  "Numérique et informatique",
  "Gestion et management",
  "Santé et social",
  "Industrie et BTP",
  "Agriculture et environnement",
  "Commerce et marketing",
];
export const DEFAULT_LEVELS = ["Certification Professionnelle", "BTS", "Licence", "Master", "Doctorat"];

const MODALITE_TO_BACK = { Présentiel: "presentiel", Distance: "distance", Hybride: "hybride" };
const MODALITE_TO_FRONT = { presentiel: "Présentiel", distance: "Distance", hybride: "Hybride" };

/**
 * Cherche un élément d'une nomenclature (niveau, type, domaine...) par son nom,
 * et le crée s'il n'existe pas encore. Renvoie son _id.
 */
async function ensure(path, nom, extra = {}) {
  const name = String(nom || "").trim();
  if (!name) return undefined;

  const items = await request(path);
  const found = items.find(
    (i) =>
      String(i.nom || "").trim().toLowerCase() === name.toLowerCase() &&
      (!extra.domaine || idOf(i.domaine) === extra.domaine)
  );
  if (found) return found._id;

  const created = unwrap(await request(path, { method: "POST", body: json({ nom: name, ...extra }) }));
  return created._id;
}

export async function loadNames(path) {
  const items = await safeList(path);
  return items.map((i) => i.nom).filter(Boolean);
}

/* ============================== CERTIFICATIONS ============================== */

function decisionFromBack(r) {
  return {
    id: r._id,
    status: r.statut,
    authority: r.autorite,
    decisionRef: r.reference || "",
    decisionDate: "",
    validFrom: day(r.dateDebut),
    validTo: day(r.dateFin),
    sourceId: r.preuve || "",
  };
}

function certificationFromBack(c, decisions = []) {
  const status = c.statutVerification?.nom || "En cours de vérification";
  return {
    id: c._id,
    title: c.title || "",
    acronym: c.sigle || "",
    code: c.code || "",
    type: c.type?.nom || "",
    domain: c.domaine?.nom || "",
    subdomain: c.sousDomaine?.nom || "",
    level: c.niveauSortie?.nom || "",
    entryLevel: c.niveauEntree?.nom || "",
    exitLevel: c.niveauSortie?.nom || "",
    duration: c.duree || "",
    hours: c.volumeHoraire || "",
    format: MODALITE_TO_FRONT[c.modalite] || "Présentiel",
    nature: c.nature?.nom || "",
    description: c.description || "",
    objectives: lines(c.objectifs),
    skills: c.competencesLibres || [],
    organizationId: idOf(c.organisme),
    organizationName: c.organisme?.nom || "",
    status,
    verificationStatus: status,
    decisions,
    establishmentIds: (c.etablissements || []).map(idOf),
    jobIds: (c.metiers || []).map(idOf),
    skillIds: (c.competences || []).map(idOf),
    published: !!c.published,
    archived: !!c.archived,
    createdAt: day(c.createdAt),
    updatedAt: day(c.updatedAt),
  };
}

async function certificationToBack(form) {
  const domaine = await ensure("/domaines", form.domain);
  const sousDomaine =
    form.subdomain && domaine
      ? await ensure("/domaines/sous-domaines", form.subdomain, { domaine })
      : undefined;

  let organisme = form.organizationId || undefined;
  if (!organisme && form.organizationName) {
    organisme = await ensure("/organismes", form.organizationName);
  }

  return {
    title: form.title,
    sigle: form.acronym,
    code: form.code,
    description: form.description,
    objectifs: lines(form.objectives).join("\n"),
    competencesLibres: lines(form.skills),
    duree: form.duration,
    volumeHoraire: form.hours,
    modalite: MODALITE_TO_BACK[form.format],
    domaine,
    sousDomaine,
    type: await ensure("/types-certification", form.type),
    nature: await ensure("/natures-certification", form.nature),
    statutVerification: await ensure("/statuts-verification", form.status),
    niveauEntree: await ensure("/niveaux", form.entryLevel),
    niveauSortie: await ensure("/niveaux", form.exitLevel || form.level),
    organisme,
    etablissements: form.establishmentIds || [],
    metiers: form.jobIds || [],
    competences: form.skillIds || [],
    published: !!form.published,
    archived: !!form.archived,
  };
}

export async function loadCertifications() {
  const [response, recos] = await Promise.all([
    request("/certifications"),
    safeList("/reconnaissances"),
  ]);

  // L'API renvoie maintenant :
  // { data: [...], pagination: {...} }

  const certs = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  console.log(
    "✅ Certifications reçues :",
    certs.length
  );

  const byCert = {};

  recos.forEach((r) => {
    const key = idOf(r.certification);

    if (!byCert[key]) {
      byCert[key] = [];
    }

    byCert[key].push(r);
  });

  return certs.map((c) =>
    certificationFromBack(
      c,
      (byCert[c._id] || [])
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .map(decisionFromBack)
    )
  );
}
export async function loadCertificationOptions() {
  const response = await safeList("/certifications");

  const certs = Array.isArray(response)
    ? response
    : response.data || [];

  return certs.map((c) => ({
    id: c._id,
    title: c.title,
  }));
}

export async function saveCertification(form) {
  const body = await certificationToBack(form);

  const saved = form.id
    ? await request(`/certifications/${form.id}`, { method: "PUT", body: json(body) })
    : await request("/certifications", { method: "POST", body: json(body) });

  // Les nouvelles décisions (id "dec_...") deviennent des reconnaissances
  const newDecisions = (form.decisions || []).filter((d) => String(d.id).startsWith("dec_"));
  for (const d of newDecisions) {
    await request("/reconnaissances", {
      method: "POST",
      body: json({
        type: "Décision",
        statut: d.status,
        autorite: d.authority || "Non précisée",
        reference: d.decisionRef || undefined,
        dateDebut: d.validFrom || undefined,
        dateFin: d.validTo || undefined,
        preuve: d.sourceId || undefined,
        certification: saved._id,
      }),
    });
  }

  return saved;
}

// Modification partielle (publier, archiver...)
export async function patchCertification(id, changes) {
  const body = { ...changes };
  if (changes.status) {
    body.statutVerification = await ensure("/statuts-verification", changes.status);
    delete body.status;
  }
  return request(`/certifications/${id}`, { method: "PUT", body: json(body) });
}

export const removeCertification = (id) => request(`/certifications/${id}`, { method: "DELETE" });

/* ============================== RÉFÉRENTIELS ============================== */

// clé du back-office -> champ du backend
const REFERENCES = {
  organizations: {
    path: "/organismes",
    fields: { name: "nom", type: "type", country: "pays", website: "siteWeb", description: "description" },
  },
  establishments: {
    path: "/etablissements",
    fields: {
      name: "nom",
      type: "type",
      region: "region",
      city: "ville",
      address: "adresse",
      website: "siteWeb",
      description: "description",
    },
  },
  jobs: { path: "/metiers", fields: { name: "nom", description: "description" } },
  skills: { path: "/competences", fields: { name: "nom", description: "description" } },
};

export async function loadReference(type) {
  const { path, fields } = REFERENCES[type];
  const items = await request(path);

  return items.map((item) => ({
    id: item._id,
    status: "Actif",
    ...Object.fromEntries(Object.entries(fields).map(([front, back]) => [front, item[back] || ""])),
  }));
}

export async function saveReference(type, form) {
  const { path, fields } = REFERENCES[type];
  const body = Object.fromEntries(Object.entries(fields).map(([front, back]) => [back, form[front] || ""]));

  return form.id
    ? request(`${path}/${form.id}`, { method: "PUT", body: json(body) })
    : request(path, { method: "POST", body: json(body) });
}

export const removeReference = (type, id) =>
  request(`${REFERENCES[type].path}/${id}`, { method: "DELETE" });

/* ============================== SOURCES & DOCUMENTS ============================== */

const QUALITY = {
  sources: {
    path: "/sources",
    toFront: (b) => ({
      id: b._id,
      name: b.nom,
      type: b.type || "",
      reference: b.reference || "",
      url: b.url || "",
      date: day(b.datePublication),
      certificationId: idOf(b.certification),
    }),
    toBack: (f) => ({
      nom: f.name,
      type: f.type || "",
      reference: f.reference || "",
      url: f.url || "",
      datePublication: f.date || undefined,
      certification: f.certificationId,
    }),
  },
  documents: {
    path: "/documents",
    toFront: (b) => ({
      id: b._id,
      name: b.titre,
      type: b.type || "",
      url: b.url || "",
      description: b.description || "",
      certificationId: idOf(b.certification),
    }),
    toBack: (f) => ({
      titre: f.name,
      type: f.type || "",
      url: f.url || "",
      description: f.description || "",
      certification: f.certificationId,
    }),
  },
};

export async function loadQuality(resource) {
  const { path, toFront } = QUALITY[resource];
  return (await request(path)).map(toFront);
}

export async function saveQuality(resource, form) {
  const { path, toBack } = QUALITY[resource];
  const body = toBack(form);

  return form.id
    ? request(`${path}/${form.id}`, { method: "PUT", body: json(body) })
    : request(path, { method: "POST", body: json(body) });
}

/* ============================== DEMANDES (contributions) ============================== */

const STATUS_TO_FRONT = {
  a_verifier: "À vérifier",
  complement: "Complément demandé",
  acceptee: "Acceptée",
  rejetee: "Rejetée",
  publiee: "Publiée",
};
const STATUS_TO_BACK = Object.fromEntries(Object.entries(STATUS_TO_FRONT).map(([k, v]) => [v, k]));

export async function loadRequests() {
  const items = await request("/contributions");

  return items.map((c) => {
    let parsed;
    try {
      parsed = JSON.parse(c.contenu);
    } catch {
      parsed = { entity: c.contenu, note: "" };
    }

    return {
      id: c._id,
      entity: parsed.entity || c.certification?.title || "—",
      note: parsed.note || c.commentaire || "",
      type: c.type,
      requester: c.auteur?.name || "—",
      submittedAt: day(c.createdAt),
      priority: "Normale",
      status: STATUS_TO_FRONT[c.statut] || c.statut,
    };
  });
}

export const createRequest = ({ type, entity, note }) =>
  request("/contributions", {
    method: "POST",
    body: json({ type, contenu: json({ entity, note }) }),
  });

export const setRequestStatus = (id, status, commentaire) =>
  request(`/contributions/${id}/status`, {
    method: "PUT",
    body: json({ statut: STATUS_TO_BACK[status], commentaire }),
  });

/* ============================== NOTIFICATIONS & AUDIT ============================== */

export async function loadNotifications() {
  const items = await request("/notifications");
  return items.map((n) => ({
    id: n._id,
    title: n.type,
    text: n.message,
    read: !!n.lu,
    date: day(n.createdAt),
  }));
}

export const markNotificationRead = (id) => request(`/notifications/${id}/read`, { method: "PUT" });

export async function loadAudit() {
  const response = await request("/audit");

  const audits = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  return audits.map((a) => ({
    id: a._id || a.id,
    date: a.createdAt
      ? new Date(a.createdAt).toLocaleString("fr-FR")
      : "",
    user:
      a.utilisateur?.name ||
      a.utilisateur?.email ||
      "Utilisateur inconnu",
    action: a.action || "",
    entity: a.entite || "",
    details: a.details || "",
  }));
}

/* ============================== UTILISATEURS ============================== */

const ROLE_LABELS = {
  admin: "Super administrateur",
  editor: "Administrateur éditorial",
  verifier: "Vérificateur",
  etablissement: "Établissement / institution",
};
const ROLE_TO_BACK = Object.fromEntries(Object.entries(ROLE_LABELS).map(([k, v]) => [v, k]));

export async function loadUsers() {
  const items = await request("/users");
  return items.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: ROLE_LABELS[u.role] || u.role,
    status: "Actif",
  }));
}

export async function saveUser(form) {
  const role = ROLE_TO_BACK[form.role] || "admin";

  return form.id
    ? request(`/users/${form.id}`, {
        method: "PUT",
        body: json({ name: form.name, email: form.email, role }),
      })
    : request("/users", {
        method: "POST",
        body: json({ name: form.name, email: form.email, password: form.password, role }),
      });
}

export async function loadNotifications() {
  const response = await request("/notifications");

  const notifications = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  return notifications.map((notification) => ({
    id: notification._id || notification.id,
    title: notification.title || "Notification",
    text: notification.message || notification.text || "",
    read: notification.read || notification.isRead || false,
    date: notification.createdAt
      ? new Date(notification.createdAt).toLocaleString("fr-FR")
      : "",
  }));
}

export async function markNotificationRead(id) {
  return request(`/notifications/${id}/read`, {
    method: "PUT",
  });
}
/* ============================== TABLEAU DE BORD ============================== */

export async function loadRemoteStore() {
  const [certifications, organizations, establishments, documents, requests, audit,  notifications] = await Promise.all([
    loadCertifications().catch(() => []),
    loadReference("organizations").catch(() => []),
    loadReference("establishments").catch(() => []),
    loadQuality("documents").catch(() => []),
    loadRequests().catch(() => []),
    loadAudit().catch(() => []),
     loadNotifications().catch(() => []),
  ]);

  return { certifications, organizations, establishments, documents, requests, audit, notifications };
}