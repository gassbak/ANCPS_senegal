const Certification =
  require("../models/Certification");

const Reconnaissance =
  require("../models/Reconnaissance");

const searchCertifications =
  async (filters) => {

    const query = {};

    if (filters.q) {
      query.$or = [
        {
          title: {
            $regex: filters.q,
            $options: "i"
          }
        },
        {
          sigle: {
            $regex: filters.q,
            $options: "i"
          }
        }
      ];
    }

    if (filters.niveau) {
      query.niveau = filters.niveau;
    }

    if (filters.duree) {
      query.duree = filters.duree;
    }

    if (filters.modalite) {
      query.modalite = filters.modalite;
    }

    if (filters.domaine) {
      query.domaine = filters.domaine;
    }

    if (filters.sousDomaine) {
      query.sousDomaine =
        filters.sousDomaine;
    }

    if (filters.organisme) {
      query.organisme =
        filters.organisme;
    }

    if (filters.etablissement) {
      query.etablissements =
        filters.etablissement;
    }

    if (filters.metier) {
      query.metiers =
        filters.metier;
    }

    if (filters.competence) {
      query.competences =
        filters.competence;
    }

    const results =
      await Certification.find(query)
        .populate("domaine")
        .populate("sousDomaine")
        .populate("metiers")
        .populate("competences")
        .populate("organisme")
        .populate({
          path: "etablissements",
          match: {
            ...(filters.region && {
              region: {
                $regex: filters.region,
                $options: "i"
              }
            }),

            ...(filters.ville && {
              ville: {
                $regex: filters.ville,
                $options: "i"
              }
            })
          }
        });

    if (filters.region || filters.ville) {
      return results.filter(
        (certification) =>
          certification.etablissements
            .length > 0
      );
    }

    if (filters.statut) {

      const reconnaissances =
        await Reconnaissance.find({
          statut: {
            $regex: filters.statut,
            $options: "i"
          }
        });

      const ids =
        reconnaissances.map(
          (item) =>
            item.certification.toString()
        );

      return results.filter(
        (certification) =>
          ids.includes(
            certification._id.toString()
          )
      );
    }

    return results;
  };

module.exports = {
  searchCertifications
};