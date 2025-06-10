const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const GetTasksByTaskId = asyncHandler(async (req, res) => {
     const { taskId } = req.params;
     try {
          if (!taskId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false,
               });
          }
          const Tasks = await prisma.task.findMany({
               where: {
                    id: taskId
               },
               include: {
                    tags: true
               }
          })
          return res.status(201).json({
               message: "Task Fetched Successfully",
               success: true,
               task: Tasks
          });
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          });
     }
})
module.exports = { GetTasksByTaskId }