const express = require("express");
const { AddTasks } = require("../controllers/task/AddTask");
const { GetAllTasksByColumnId } = require("../controllers/task/GetAllTasksByColumnId");
const { fetchAllTasksForBoard } = require("../controllers/task/fetchAllTasksForBoard");
const { DeleteTask } = require("../controllers/task/DeleteTask");
const { UpdateTask } = require("../controllers/task/UpdateTask");
const { GetTasksByTaskId } = require("../controllers/task/GetTaskByTaskId");
const router = express.Router();

router.post("/add", AddTasks);
router.delete("/del/:taskId", DeleteTask);
router.post("/update/:taskId", UpdateTask);
router.get("/getAll/:columnId", GetAllTasksByColumnId);
router.get("/board/:boardId", fetchAllTasksForBoard);
router.get("/get/:taskId", GetTasksByTaskId);

module.exports = router;