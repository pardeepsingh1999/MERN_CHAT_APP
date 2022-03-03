const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use("*", protect);

router.route("/").get(fetchChat).post(accessChat);

router.route("/group").post(createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/groupadd").put(addToGroup);
router.route("/groupremove").put(removeFromGroup);

module.exports = router;
