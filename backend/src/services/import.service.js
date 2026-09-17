const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const XLSX = require("xlsx");

const Certification =
  require("../models/Certification");


const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
};


const readExcel = (filePath) => {

  const workbook =
    XLSX.readFile(filePath);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  return XLSX.utils.sheet_to_json(sheet);
};


const readFile = async (filePath) => {

  const extension =
    path.extname(filePath)
      .toLowerCase();

  if (extension === ".csv") {
    return readCSV(filePath);
  }

  if (
    extension === ".xlsx" ||
    extension === ".xls"
  ) {
    return readExcel(filePath);
  }

  throw new Error(
    "Format non supporté"
  );
};


const validateData = async (data) => {

  const valid = [];
  const errors = [];

  for (let i = 0; i < data.length; i++) {

    const row = data[i];

    if (!row.title) {
      errors.push({
        ligne: i + 2,
        erreur: "title obligatoire"
      });

      continue;
    }

    const existing =
      await Certification.findOne({
        title: row.title
      });

    if (existing) {
      errors.push({
        ligne: i + 2,
        erreur: "Certification déjà existante",
        title: row.title
      });

      continue;
    }

    valid.push({
      title: row.title,
      sigle: row.sigle,
      description: row.description,
      niveau: row.niveau,
      duree: row.duree,
      modalite: row.modalite
    });
  }

  return {
    valid,
    errors
  };
};


const importCertifications =
  async (data) => {

    if (data.length === 0) {
      return [];
    }

    return Certification.insertMany(
      data
    );
  };


module.exports = {
  readFile,
  validateData,
  importCertifications
};