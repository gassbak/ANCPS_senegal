const express = require("express");

const authRoutes =
  require("./routes/auth.routes");

const certificationRoutes =
  require("./routes/certification.routes");

const domaineRoutes =
  require("./routes/domaine.routes");
const metierRoutes =
  require("./routes/metier.routes");

const competenceRoutes =
  require("./routes/competence.routes");
  const organismeRoutes =
  require("./routes/organisme.routes");

const etablissementRoutes =
  require("./routes/etablissement.routes");
  const sourceRoutes =
  require("./routes/source.routes");

const documentRoutes =
  require("./routes/document.routes");
  const reconnaissanceRoutes =
  require("./routes/reconnaissance.routes");
  const searchRoutes =
  require("./routes/search.routes");
  const contributionRoutes =
  require("./routes/contribution.routes");
  const auditRoutes =
  require("./routes/audit.routes");
  const importRoutes =
  require("./routes/import.routes");
  const notificationRoutes =
  require("./routes/notification.routes");
  const expiryRoutes =
  require("./routes/expiry.routes");
  const niveauRoutes =
  require("./routes/niveau.routes");

const typeRoutes =
  require("./routes/typeCertification.routes");

const natureRoutes =
  require("./routes/natureCertification.routes");

const statutRoutes =
  require("./routes/statutVerification.routes");
const app = express();

app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/certifications",
  certificationRoutes
);

app.use(
  "/api/domaines",
  domaineRoutes
);
app.use(
  "/api/metiers",
  metierRoutes
);

app.use(
  "/api/competences",
  competenceRoutes
);
app.use(
  "/api/organismes",
  organismeRoutes
);

app.use(
  "/api/etablissements",
  etablissementRoutes
);
app.use(
  "/api/sources",
  sourceRoutes   
);

app.use(
  "/api/documents",
  documentRoutes
);    
app.use(
  "/api/reconnaissances",
  reconnaissanceRoutes
);
app.use(
  "/api/search",
  searchRoutes
);
app.use(
  "/api/contributions",
  contributionRoutes
);
app.use(
  "/api/audit",
  auditRoutes
);
app.use(
  "/api/import",
  importRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use(
  "/api/expiry",
  expiryRoutes
);
app.use(
  "/api/niveaux",
  niveauRoutes
);

app.use(
  "/api/types-certification",
  typeRoutes
);

app.use(
  "/api/natures-certification",
  natureRoutes
);

app.use(
  "/api/statuts-verification",
  statutRoutes
);
app.get("/", (req, res) => {
  res.json({
    message: "API Annuaire Certifications Sénégal"
  });
});

module.exports = app;