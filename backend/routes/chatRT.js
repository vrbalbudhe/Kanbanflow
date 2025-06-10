const express = require("express");
const { AddChat } = require("../controllers/chat/AddChat");
const { GetAllChat } = require("../controllers/chat/GetAllChat");
const { GetAllTasksByBoardId } = require("../controllers/chat/GetAllTasksByBoardId");
const router = express.Router();

router.post("/add/:taskId", AddChat);
router.get("/getAll/:taskId", GetAllChat);
router.get("/getAllByBoardId/:boardId", GetAllTasksByBoardId);

module.exports = router;