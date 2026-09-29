require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/certifications", require("./routes/certification.routes"));
app.use("/api/domaines", require("./routes/domaine.routes"));
app.use("/api/metiers", require("./routes/metier.routes"));
app.use("/api/competences", require("./routes/competence.routes"));
app.use("/api/organismes", require("./routes/organisme.routes"));
app.use("/api/etablissements", require("./routes/etablissement.routes"));
app.use("/api/sources", require("./routes/source.routes"));
app.use("/api/documents", require("./routes/document.routes"));
app.use("/api/reconnaissances", require("./routes/reconnaissance.routes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/contributions", require("./routes/contribution.routes"));
app.use("/api/audit", require("./routes/audit.routes"));
app.use("/api/import", require("./routes/import.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/expiry", require("./routes/expiry.routes"));
app.use("/api/niveaux", require("./routes/niveau.routes"));
app.use("/api/types-certification", require("./routes/typeCertification.routes"));
app.use("/api/natures-certification", require("./routes/natureCertification.routes"));
app.use("/api/statuts-verification", require("./routes/statutVerification.routes"));
app.use("/api/users", require("./routes/user.routes"));

app.get("/", (req, res) => {
  res.json({ message: "API Annuaire Certifications Sénégal" });
});

module.exports = app;