const User =
  require("../models/User");

const getUsers =
  async (req, res) => {
    try {
      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1
          });

      res.json(users);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

const getUser =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message:
            "Utilisateur introuvable"
        });
      }

      res.json(user);

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

module.exports = {
  getUsers,
  getUser
};