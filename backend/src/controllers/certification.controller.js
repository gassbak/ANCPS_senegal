const Certification = require("../models/Certification");

const {
  createAuditLog
} = require("../services/audit.service");

const getPagination = require("../utils/pagination");


// CRÉER
const createCertification = async (req, res) => {
  try {

    const certification = await Certification.create(req.body);

    await createAuditLog({
      utilisateur: req.user._id,
      action: "CREATION",
      entite: "Certification",
      entiteId: certification._id,
      details: "Création d'une certification"
    });

    res.status(201).json(certification);

  } catch (error) {
    console.error("Erreur création certification :", error);

    res.status(400).json({
      message: error.message
    });
  }
};


// LISTE
// LISTE
const getCertifications = async (req, res) => {
  try {
    const filter = {};

    // ==========================================
    // ANNuaire PUBLIC
    // ==========================================
    if (req.query.published === "true") {
      filter.published = true;
      filter.archived = { $ne: true };

      const certifications =
        await Certification.find(filter)
          .populate("niveauEntree")
          .populate("niveauSortie")
          .populate("type")
          .populate("nature")
          .populate("statutVerification")
          .populate("domaine")
          .populate("sousDomaine")
          .populate("metiers")
          .populate("competences")
          .populate("organisme")
          .populate("etablissements")
          .sort({ createdAt: -1 });

      return res.json({
        data: certifications,
        pagination: {
          page: 1,
          limit: certifications.length,
          total: certifications.length,
          totalPages: 1,
        },
      });
    }

    // ==========================================
    // ADMIN
    // Toutes les certifications
    // ==========================================
    const certifications =
      await Certification.find({})
        .populate("niveauEntree")
        .populate("niveauSortie")
        .populate("type")
        .populate("nature")
        .populate("statutVerification")
        .populate("domaine")
        .populate("sousDomaine")
        .populate("metiers")
        .populate("competences")
        .populate("organisme")
        .populate("etablissements")
        .sort({ createdAt: -1 });

    return res.json({
      data: certifications,
      pagination: {
        page: 1,
        limit: certifications.length,
        total: certifications.length,
        totalPages: 1,
      },
    });

  } catch (error) {
    console.error(
      "Erreur liste certifications :",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
// DÉTAIL
const getCertification = async (req, res) => {
  try {

    const certification =
      await Certification.findById(req.params.id)
        .populate("domaine")
        .populate("sousDomaine")
        .populate("metiers")
        .populate("competences")
        .populate("organisme")
        .populate("etablissements")
        .populate("niveauEntree")
        .populate("niveauSortie")
        .populate("type")
        .populate("nature")
        .populate("statutVerification");

    if (!certification) {
      return res.status(404).json({
        message: "Certification introuvable"
      });
    }

    res.json(certification);

  } catch (error) {
    console.error("Erreur détail certification :", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// MODIFIER
const updateCertification = async (req, res) => {
  try {
    const ancienneCertification =
      await Certification.findById(req.params.id);

    if (!ancienneCertification) {
      return res.status(404).json({
        message: "Certification introuvable"
      });
    }

    const certification =
      await Certification.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    let action = "MODIFICATION";
    let details =
      "Modification d'une certification";

    // PUBLICATION
    if (
      ancienneCertification.published === false &&
      certification.published === true
    ) {
      action = "PUBLICATION";
      details =
        "Publication d'une certification";
    }

    // DÉPUBLICATION
    else if (
      ancienneCertification.published === true &&
      certification.published === false
    ) {
      action = "DEPUBLICATION";
      details =
        "Dépublication d'une certification";
    }

    // ARCHIVAGE
    else if (
      ancienneCertification.archived === false &&
      certification.archived === true
    ) {
      action = "ARCHIVAGE";
      details =
        "Archivage d'une certification";
    }

    // DÉSARCHIVAGE
    else if (
      ancienneCertification.archived === true &&
      certification.archived === false
    ) {
      action = "DESARCHIVAGE";
      details =
        "Désarchivage d'une certification";
    }

    // VÉRIFICATION
    else if (
      String(
        ancienneCertification.statutVerification
      ) !==
      String(
        certification.statutVerification
      )
    ) {
      action = "VERIFICATION";
      details =
        "Modification du statut de vérification";
    }

    await createAuditLog({
      utilisateur: req.user._id,
      action,
      entite: "Certification",
      entiteId: certification._id,
      details,
      ancienneValeur:
        ancienneCertification.toObject(),
      nouvelleValeur:
        certification.toObject(),
      ip: req.ip
    });

    res.json(certification);

  } catch (error) {
    console.error(
      "Erreur modification certification :",
      error
    );

    res.status(400).json({
      message: error.message
    });
  }
};


// SUPPRIMER
const deleteCertification = async (req, res) => {
  try {

    const certification =
      await Certification.findByIdAndDelete(
        req.params.id
      );

    if (!certification) {
      return res.status(404).json({
        message: "Certification introuvable"
      });
    }

    await createAuditLog({
      utilisateur: req.user._id,
      action: "SUPPRESSION",
      entite: "Certification",
      entiteId: certification._id,
      details: "Suppression d'une certification"
    });

    res.json({
      message: "Certification supprimée"
    });

  } catch (error) {
    console.error("Erreur suppression certification :", error);

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  createCertification,
  getCertifications,
  getCertification,
  updateCertification,
  deleteCertification
};