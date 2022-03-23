const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use("*", protect);

router.get("/", fetchChat);
router.post("/", accessChat);

router.post("/group", createGroupChat);
router.put("/rename", renameGroup);
router.put("/groupadd", addToGroup);
router.put("/groupremove", removeFromGroup);

module.exports = router;
