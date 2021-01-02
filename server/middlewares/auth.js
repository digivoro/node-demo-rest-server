const jwt = require("jsonwebtoken");

// Token verification
let verifyToken = (req, res, next) => {
  let token = req.get("Authorization");
  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) {
      res.status(401).json({
        ok: false,
        error: err.message
      });
    } else {
      req.user = decoded.user;
      next();
    }
  });
};

// Role verificatioon
let verifyAdminRole = (req, res, next) => {
  let { user } = req;
  if (user.role !== "ADMIN_ROLE") {
    return res.status(403).json({
      ok: false,
      error: "User does not have access rights to this content."
    });
  } else {
    next();
  }
};

module.exports = {
  verifyToken,
  verifyAdminRole
};
