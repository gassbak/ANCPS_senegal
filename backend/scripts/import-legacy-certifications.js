const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../src/config/database");

const Certification = require("../src/models/Certification");
const Domaine = require("../src/models/Domaine");
const Niveau = require("../src/models/Niveau");
const Organisme = require("../src/models/Organisme");
const StatutVerification = require("../src/models/StatutVerification");

const certifications = require("../data/legacy-certifications.json");

/**
 * Correspondance entre les anciens domaines
 * et les domaines du nouveau référentiel ANCPS.
 */
const DOMAIN_MAP = {
  "Informatique & Numérique": "Numérique et informatique",
  "Commerce & Marketing": "Commerce et marketing",
  "Gestion & Management": "Gestion et management",
  "Santé & Social": "Santé et social",
  "Industrie & BTP": "Industrie et BTP",
  "Agriculture & Environnement": "Agriculture et environnement"
};

/**
 * Correspondance ancien format → nouveau format.
 */
const MODALITE_MAP = {
  "Présentiel": "presentiel",
  "En ligne": "distance",
  "Hybride": "hybride"
};

/**
 * Recherche exacte insensible à la casse.
 * Permet notamment d'éviter :
 * BAKELI
 * Bakeli
 * bakeli
 */
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const findOneByName = async (Model, name) => {
  if (!name) return null;

  return Model.findOne({
    nom: {
      $regex: `^${escapeRegex(name.trim())}$`,
      $options: "i"
    }
  });
};

/**
 * Recherche ou création d'un domaine.
 */
const getOrCreateDomaine = async (ancienNom) => {
  const nouveauNom =
    DOMAIN_MAP[ancienNom] || ancienNom;

  let domaine = await findOneByName(
    Domaine,
    nouveauNom
  );

  if (domaine) {
    return domaine;
  }

  domaine = await Domaine.create({
    nom: nouveauNom,
    description:
      "Domaine importé depuis l'ancien référentiel ANCPS. À vérifier."
  });

  console.log(`+ Domaine créé : ${nouveauNom}`);

  return domaine;
};

/**
 * Recherche ou création d'un niveau.
 */
const getOrCreateNiveau = async (nom) => {
  let niveau = await findOneByName(
    Niveau,
    nom
  );

  if (niveau) {
    return niveau;
  }

  niveau = await Niveau.create({
    nom: nom.trim(),
    description:
      "Niveau importé depuis l'ancien référentiel ANCPS. À vérifier."
  });

  console.log(`+ Niveau créé : ${nom}`);

  return niveau;
};

/**
 * Recherche ou création d'un organisme.
 */
const getOrCreateOrganisme = async (nom) => {
  let organisme = await findOneByName(
    Organisme,
    nom
  );

  if (organisme) {
    return organisme;
  }

  organisme = await Organisme.create({
    nom: nom.trim(),
    description:
      "Organisme importé depuis l'ancien référentiel ANCPS. À vérifier."
  });

  console.log(`+ Organisme créé : ${nom}`);

  return organisme;
};

/**
 * Recherche ou création du statut de vérification.
 */
const getOrCreateStatut = async () => {
  const nom = "En cours de vérification";

  let statut = await findOneByName(
    StatutVerification,
    nom
  );

  if (statut) {
    return statut;
  }

  statut = await StatutVerification.create({
    nom,
    description:
      "Certification importée depuis un ancien référentiel et non encore vérifiée."
  });

  console.log(`+ Statut créé : ${nom}`);

  return statut;
};

/**
 * Import principal.
 */
const importCertifications = async () => {
  try {
    console.log("======================================");
    console.log("IMPORT DES ANCIENNES CERTIFICATIONS");
    console.log("======================================");

    console.log(
      `Nombre de certifications dans le fichier : ${certifications.length}`
    );

    const statutVerification =
      await getOrCreateStatut();

    let created = 0;
    let existing = 0;
    let errors = 0;

    for (const item of certifications) {
      try {
        console.log("");
        console.log(
          `Traitement : ${item.id} - ${item.title}`
        );

        /*
         * Vérification du code.
         * Si cert_101 existe déjà, on ne crée pas
         * une deuxième certification.
         */
        const alreadyExists =
          await Certification.findOne({
            code: item.id
          });

        if (alreadyExists) {
          console.log(
            `= Déjà existante : ${item.id}`
          );

          existing++;
          continue;
        }

        /*
         * Référentiels
         */
        const domaine =
          await getOrCreateDomaine(
            item.domain
          );

        const niveauSortie =
          await getOrCreateNiveau(
            item.level
          );

        const organisme =
          await getOrCreateOrganisme(
            item.organizationName
          );

        /*
         * Modalité
         */
        const modalite =
          MODALITE_MAP[item.format] || null;

        /*
         * Objectifs :
         * tableau ancien → texte nouveau
         */
        const objectifs =
          Array.isArray(item.objectives)
            ? item.objectives.join("\n")
            : item.objectives || "";

        /*
         * Création de la certification
         */
        const certification =
          await Certification.create({
            title: item.title,

            code: item.id,

            description:
              item.description || "",

            objectifs,

            publicCible: "",

            conditionsAcces: "",

            /*
             * On considère "level" comme niveau
             * de sortie de la certification.
             *
             * Le niveau d'entrée reste vide car
             * l'ancien seed ne contient pas cette
             * information.
             */
            niveauEntree: null,
            niveauSortie: niveauSortie._id,

            type: null,
            nature: null,

            statutVerification:
              statutVerification._id,

            duree: item.duration || "",

            volumeHoraire: "",

            modalite,

            domaine: domaine._id,

            sousDomaine: null,

            metiers: [],

            competences: [],

            organisme: organisme._id,

            etablissements: [],

            /*
             * IMPORTANT :
             * on ne reprend PAS isPublished=true.
             *
             * Les données sont considérées comme
             * non vérifiées dans le nouveau système.
             */
            published: false,
            archived: false,

            /*
             * Les anciennes compétences ne sont pas
             * encore des documents Competence.
             * On les conserve donc temporairement
             * comme compétences libres.
             */
            competencesLibres:
              Array.isArray(item.skills)
                ? item.skills
                : []
          });

        /*
         * On conserve la date de l'ancien seed
         * lorsque celle-ci est disponible.
         */
        if (item.createdAt) {
          const oldDate =
            new Date(item.createdAt);

          if (!Number.isNaN(oldDate.getTime())) {
            certification.createdAt = oldDate;
            certification.updatedAt = oldDate;

            await certification.save();
          }
        }

        console.log(
          `✓ Créée : ${certification.code} - ${certification.title}`
        );

        created++;
      } catch (error) {
        errors++;

        console.error(
          `✗ Erreur pour ${item.id} :`,
          error.message
        );
      }
    }

    console.log("");
    console.log("======================================");
    console.log("IMPORT TERMINÉ");
    console.log("======================================");
    console.log(`Créées    : ${created}`);
    console.log(`Existantes: ${existing}`);
    console.log(`Erreurs   : ${errors}`);
    console.log(
      `Total     : ${created + existing + errors}`
    );
    console.log("======================================");
  } catch (error) {
    console.error(
      "Erreur générale :",
      error
    );
  }
};

/**
 * Connexion puis import.
 */
const run = async () => {
  try {
    await connectDB();

    console.log("MongoDB connecté.");
    console.log("");

    await importCertifications();
  } catch (error) {
    console.error(
      "Erreur de connexion/import :",
      error.message
    );
  } finally {
    await mongoose.connection.close();
    console.log("");
    console.log("Connexion MongoDB fermée.");
  }
};

run();