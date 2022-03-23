const express = require("express");
const { sendMessage, getAllMessages } = require("../controllers/message");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use("*", protect);

router.post("/", sendMessage);
router.get("/:chatId", getAllMessages);

module.exports = router;
