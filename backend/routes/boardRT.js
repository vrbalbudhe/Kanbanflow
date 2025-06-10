const express = require("express");
const { AddBoard } = require("../controllers/board/AddBoard");
const { GetByUserId } = require("../controllers/board/GetByUserId");
const { DeleteBoard } = require("../controllers/board/DeleteBoard");
const { GetByBoardId } = require("../controllers/board/GetByBoardId");
const { GetAllBoards } = require("../controllers/board/GetAllBoards");
const route = express.Router();

route.post("/add", AddBoard);
route.get("/getAll", GetAllBoards);

// Route for the Fetching all Boards With the specific user ID
route.get("/get/:id", GetByUserId)

// Route for the Fetching the specific board with the specific Board Id
route.get("/getBoard/:boardId", GetByBoardId)

route.delete("/del/:id", DeleteBoard);


module.exports = route;