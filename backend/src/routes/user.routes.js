const express =
  require("express");

const {
  getUsers,
  getUser
} = require(
  "../controllers/user.controller"
);

const protect =
  require(
    "../middlewares/auth.middleware"
  );

const authorize =
  require(
    "../middlewares/role.middleware"
  );

const router =
  express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getUser
);

module.exports = router;