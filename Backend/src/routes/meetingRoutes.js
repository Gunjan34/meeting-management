const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {getMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting} = require("../controllers/meetingController");

router.get("/", authMiddleware, getMeetings);
router.get("/:id", authMiddleware, getMeetingById);
router.post("/", authMiddleware, createMeeting);
router.put("/:id", authMiddleware, updateMeeting);
router.delete("/:id", authMiddleware, deleteMeeting);
module.exports = router;
