require("dotenv").config();

const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");

const User =
  require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    const email =
      "admin@ancps.sn";

    const existe =
      await User.findOne({
        email
      });

    if (existe) {
      console.log(
        "Admin déjà existant"
      );
      return;
    }

    const password =
      await bcrypt.hash(
        "admin123",
        10
      );

    await User.create({
      name: "Administrateur",
      email,
      password,
      role: "admin"
    });

    console.log(
      "Admin créé avec succès"
    );

    console.log(
      "Email : admin@ancps.sn"
    );

    console.log(
      "Mot de passe : admin123"
    );

  } catch (error) {

    console.error(
      "Erreur :",
      error.message
    );

  } finally {

    await mongoose.disconnect();

  }
};

seedAdmin();