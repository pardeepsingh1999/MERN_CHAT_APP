const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: true, reason: "Not authorized, token failed" });
    }
  }

  return res
    .status(401)
    .json({ error: true, reason: "Not authorized, Authorization is required" });
};

module.exports = { protect };
