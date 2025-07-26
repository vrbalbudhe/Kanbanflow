const express = require("express");
const { GetAllParticipants } = require("../controllers/participants/GetAllParticipants");
const { AddParticipants } = require("../controllers/participants/AddParticipant");
const { UpdateParticipant } = require("../controllers/participants/UpdateParticipants");
const { DeleteParticipants } = require("../controllers/participants/DeleteParticipants");
const { UserBoardCheck } = require("../controllers/participants/UserBoardCheck");
const router = express.Router();

router.get("/getAll/:boardId", GetAllParticipants);
router.post("/add/:boardId", AddParticipants);
router.post("/update/:participantId", UpdateParticipant);
router.delete("/del/:participantsId", DeleteParticipants);
router.post("/check", UserBoardCheck);

module.exports = router;