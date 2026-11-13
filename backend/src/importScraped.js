require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/database");

const Certification = require("./models/Certification");
const Domaine = require("./models/Domaine");
const Niveau = require("./models/Niveau");
const NatureCertification = require("./models/NatureCertification");
const Organisme = require("./models/Organisme");
const StatutVerification = require("./models/StatutVerification");
const TypeCertification = require("./models/TypeCertification");

const inputPath = path.join(__dirname, "..", "formations_scrappees.json");
const MODALITIES = new Map([
  ["présentiel", "presentiel"],
  ["presentiel", "presentiel"],
  ["à distance", "distance"],
  ["distance", "distance"],
  ["hybride", "hybride"]
]);

function sourceOrigin(sourceUrl) {
  if (typeof sourceUrl !== "string" || !sourceUrl.trim()) return undefined;

  try {
    const url = new URL(sourceUrl.trim());
    return ["http:", "https:"].includes(url.protocol) ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

function hasValidOptionalSourceUrl(sourceUrl) {
  return (
    sourceUrl === undefined ||
    sourceUrl === null ||
    (typeof sourceUrl === "string" && !sourceUrl.trim()) ||
    Boolean(sourceOrigin(sourceUrl))
  );
}

function buildCertificationDocument(entry, references) {
  const document = {
    title: entry.title.trim(),
    description: entry.description?.trim() || undefined,
    sourceLastVerifiedAt: entry.last_verified_at || undefined,
    lieu: entry.location?.trim() || undefined,
    organisme: references.organisme,
    type: references.type,
    nature: references.nature
  };

  if (sourceOrigin(entry.source_url)) {
    document.sourceUrl = entry.source_url.trim();
  }

  const domaine = references.domaines.get(entry.domain);
  if (domaine) document.domaine = domaine;

  const niveau = references.niveaux.get(entry.level);
  if (niveau) document.niveauSortie = niveau;

  const modalite = MODALITIES.get(entry.delivery_mode?.trim().toLowerCase());
  if (modalite) document.modalite = modalite;

  return document;
}

async function findOrCreateReference(Model, nom, extra = {}) {
  return Model.findOneAndUpdate(
    { nom },
    { $setOnInsert: { nom, ...extra } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

async function createReferenceMap(Model, names, descriptions = {}) {
  const references = new Map();
  for (const nom of names) {
    const reference = await findOrCreateReference(Model, nom, {
      description: descriptions[nom]
    });
    references.set(nom, reference._id);
  }
  return references;
}

async function importScrapedFormations(entries) {
  if (!Array.isArray(entries)) {
    throw new Error("Le fichier de formations doit contenir un tableau JSON.");
  }

  const validEntries = [];
  const invalidEntries = [];
  for (const [index, entry] of entries.entries()) {
    if (
      !entry ||
      typeof entry.title !== "string" ||
      !entry.title.trim() ||
      !hasValidOptionalSourceUrl(entry.source_url) ||
      typeof entry.organization !== "string" ||
      !entry.organization.trim()
    ) {
      invalidEntries.push(index + 1);
      continue;
    }
    validEntries.push(entry);
  }

  if (invalidEntries.length > 0) {
    throw new Error(
      `Entrées invalides (lignes JSON ${invalidEntries.join(", ")}); aucune donnée n'a été importée.`
    );
  }
  if (validEntries.length === 0) {
    console.log("Aucune formation à importer.");
    return { inserted: 0, updated: 0 };
  }

  const domainNames = [
    ...new Set(validEntries.map((entry) => entry.domain).filter(Boolean))
  ];
  const levelNames = [
    ...new Set(
      validEntries
        .map((entry) => entry.level)
        .filter((name) => name && name !== "À préciser" && name !== "Certification" && name !== "Professionnel")
    )
  ];
  const typeNames = [
    ...new Set(validEntries.map((entry) => entry.type).filter(Boolean))
  ];
  const natureNames = [
    ...new Set(
      validEntries.map((entry) =>
        /certification/i.test(entry.type || "") ? "Certification" : "Diplôme / Formation"
      )
    )
  ];
  const organizationNames = [
    ...new Set(validEntries.map((entry) => entry.organization.trim()))
  ];

  const [domainRefs, levelRefs, typeRefs, natureRefs, statut] =
    await Promise.all([
      createReferenceMap(Domaine, domainNames, {
        "À préciser": "Domaine à déterminer lors de la vérification."
      }),
      createReferenceMap(Niveau, levelNames),
      createReferenceMap(TypeCertification, typeNames),
      createReferenceMap(NatureCertification, natureNames),
      findOrCreateReference(
        StatutVerification,
        "À vérifier",
        { description: "Donnée importée automatiquement, à valider par un administrateur." }
      )
    ]);

  const organizationRefs = new Map();
  for (const nom of organizationNames) {
    const entry = validEntries.find(
      (item) => item.organization.trim() === nom && sourceOrigin(item.source_url)
    );
    organizationRefs.set(
      nom,
      await findOrCreateReference(Organisme, nom, {
        type: "Source de formation",
        pays: "Sénégal",
        siteWeb: entry ? sourceOrigin(entry.source_url) : undefined,
        description: "Organisme identifié à partir d'une source de formation."
      }).then((organization) => organization._id)
    );
  }

  const operationsByUrl = new Map();
  for (const entry of validEntries) {
    const references = {
      organisme: organizationRefs.get(entry.organization.trim()),
      type: typeRefs.get(entry.type),
      nature: natureRefs.get(
        /certification/i.test(entry.type || "")
          ? "Certification"
          : "Diplôme / Formation"
      ),
      statutVerification: statut._id,
      domaines: domainRefs,
      niveaux: levelRefs
    };
    const document = buildCertificationDocument(entry, references);
    const hasSourceUrl = Boolean(document.sourceUrl);
    const operationKey = hasSourceUrl
      ? document.sourceUrl
      : `${document.title}:${String(document.organisme)}`;
    const identityFilter = {
      title: document.title,
      organisme: document.organisme
    };
    const existingBySourceUrl = hasSourceUrl
      ? await Certification.findOne({ sourceUrl: document.sourceUrl }).select("_id")
      : null;
    const existing =
      existingBySourceUrl ||
      (await Certification.findOne(identityFilter).select("_id"));
    const update = {
      $set: document,
      $setOnInsert: {
        statutVerification: statut._id,
        published: false,
        archived: false
      }
    };
    if (!hasSourceUrl) update.$unset = { sourceUrl: "" };

    operationsByUrl.set(operationKey, {
      updateOne: {
        filter: existing ? { _id: existing._id } : identityFilter,
        update,
        upsert: true
      }
    });
  }

  const result = await Certification.bulkWrite(
    [...operationsByUrl.values()],
    { ordered: true }
  );

  return {
    inserted: result.upsertedCount,
    updated: result.modifiedCount,
    processed: operationsByUrl.size
  };
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI est absent de la configuration.");
  }
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Fichier introuvable : ${inputPath}`);
  }

  const entries = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  await connectDB();
  try {
    const result = await importScrapedFormations(entries);
    console.log(
      `Import terminé : ${result.inserted} ajoutée(s), ${result.updated} mise(s) à jour` +
        (result.processed === undefined ? "." : ` sur ${result.processed} fiche(s).`)
    );
    console.log("Les fiches restent non publiées et au statut « À vérifier ».");
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Échec de l'import des formations :", error.message);
    process.exitCode = 1;
  });
}

module.exports = { buildCertificationDocument, importScrapedFormations };
