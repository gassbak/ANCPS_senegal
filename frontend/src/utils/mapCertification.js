const MODALITES = {
  presentiel: "Présentiel",
  distance: "À distance",
  hybride: "Hybride",
};

export function mapCertification(c) {
  return {
    id: c._id,
    title: c.title,
    sigle: c.sigle || "",
    description: c.description || "",
    type: c.type?.nom || c.nature?.nom || "Certification",
    mode: MODALITES[c.modalite] || c.modalite || "",
    organization: c.organisme?.nom || "",
    sector: c.domaine?.nom || "",
    duration: c.duree || "",
    raw: c,
  };
}