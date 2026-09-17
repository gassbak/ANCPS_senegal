const Certification =
  require("../models/Certification");

const {
  createAuditLog
} = require("../services/audit.service");

const createCertification = async (req, res) => {
  try {
    const certification =
      await Certification.create(req.body);

    await createAuditLog({
      utilisateur: req.userId,
      action: "CREATION",
      entite: "Certification",
      entiteId: certification._id,
      details: "Création d'une certification"
    });

    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const getCertifications = async (req, res) => {
  try {
   const certifications =
  await Certification.find()
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
    .populate("etablissements");

    res.json(certifications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getCertification = async (req, res) => {
  try {
    const certification =
      await Certification.findById(
        req.params.id
      )
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
    res.status(500).json({
      message: error.message
    });
  }
};

const updateCertification = async (req, res) => {
  try {
    const certification =
      await Certification.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!certification) {
      return res.status(404).json({
        message: "Certification introuvable"
      });
    }

    await createAuditLog({
      utilisateur: req.userId,
      action: "MODIFICATION",
      entite: "Certification",
      entiteId: certification._id,
      details: "Modification d'une certification"
    });

    res.json(certification);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

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
      utilisateur: req.userId,
      action: "SUPPRESSION",
      entite: "Certification",
      entiteId: certification._id,
      details: "Suppression d'une certification"
    });

    res.json({
      message: "Certification supprimée"
    });
  } catch (error) {
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