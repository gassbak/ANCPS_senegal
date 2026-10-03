const requirePermission = (...permissions) => {
  return (req, res, next) => {
    console.log("Utilisateur :", req.user.email);
console.log("Rôle :", req.user.role);
console.log("Permissions :", req.user.permissions);

    if (!req.user) {
      return res.status(401).json({
        message: "Authentification requise"
      });
    }

    // Superadmin = accès complet
    if (req.user.role === "superadmin") {
      return next();
    }

    const userPermissions = req.user.permissions || [];

    const hasPermission = permissions.some(
      permission => userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Permission insuffisante"
      });
    }

    next();
  };
};

module.exports = requirePermission;