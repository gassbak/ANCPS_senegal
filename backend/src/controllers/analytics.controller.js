
const Analytics = require("../models/Analytics");

// ENREGISTRER UNE ACTION
const createAnalytics = async (req, res) => {
  try {
    const {
      type,
      query,
      certification
    } = req.body;

    if (!type) {
      return res.status(400).json({
        message: "Le type est obligatoire"
      });
    }

    const analytics =
      await Analytics.create({
        type,
        query: query || "",
        certification:
          certification || null
      });

    res.status(201).json({
      message: "Analytics enregistré",
      analytics
    });

  } catch (error) {
    console.error(
      "Erreur création analytics :",
      error
    );

    res.status(400).json({
      message: error.message
    });
  }
};


// RÉCUPÉRER LES STATISTIQUES
const getAnalytics = async (req, res) => {
  try {
    const [
      searches,
      visits,
      views,
      noResults
    ] = await Promise.all([
      Analytics.countDocuments({
        type: "search"
      }),

      Analytics.countDocuments({
        type: "visit"
      }),

      Analytics.countDocuments({
        type: "view"
      }),

      Analytics.countDocuments({
        type: "no_result"
      })
    ]);

    res.json({
      searches,
      visits,
      views,
      noResults
    });

  } catch (error) {
    console.error(
      "Erreur récupération analytics :",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createAnalytics,
  getAnalytics
};
