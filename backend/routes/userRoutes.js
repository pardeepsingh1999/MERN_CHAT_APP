const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getLoggedInUserDetails,
} = require("../controllers/user");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route('/login').get(() => {}).post(() => {})

router.post("/register", registerUser);

router.post("/login", authUser);

router.route("/").get(protect, allUsers);

router.route("/details").get(protect, getLoggedInUserDetails);

module.exports = router;
