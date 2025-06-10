const express = require("express");
const { AddColumn } = require("../controllers/kanban/AddColumn");
const { GetAllByBoardId } = require("../controllers/kanban/GetAllByBoardId");
const { DeleteColumn } = require("../controllers/kanban/DeleteColumn");
const { ReOrderBoards } = require("../controllers/board/ReOrderBoards");
const router = express.Router();

router.post("/add", AddColumn);
router.get("/getAll/:boardId", GetAllByBoardId);
router.delete("/del/:id", DeleteColumn);
router.put("/reorder/:boardId", ReOrderBoards)

module.exports = router;