const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const fetchAllTasksForBoard = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false,
               });
          }
          const Tasks = await prisma.task.findMany({
               where: {
                    boardId: boardId
               },
               include: {
                    tags: true
               }
          })
          return res.status(201).json({
               message: "Tasks Fetched Successfully",
               success: true,
               tasks: Tasks
          });
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          });
     }
})
module.exports = { fetchAllTasksForBoard }