const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires"
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Cet email existe déjà"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};
// login
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Connexion réussie",
      token
    });
  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: "Erreur serveur"
  });
}
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};