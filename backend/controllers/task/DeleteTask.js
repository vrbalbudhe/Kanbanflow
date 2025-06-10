const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const DeleteTask = asyncHandler(async (req, res) => {
     const { taskId } = req.params;
     try {
          if (!taskId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const deleteTask = await prisma.task.delete({
               where: {
                    id: taskId
               }
          })
          if (!deleteTask) {
               return res.status(400).json({
                    message: `Unable to delete Task With ${taskId}`,
                    success: false
               })
          }
          return res.status(200).json({
               message: `Task With ${taskId} is Deleted Successfully`,
               success: true
          })
     } catch (error) {
          res.status(500).json({ error: "Internal server error" });
     }
})

module.exports = { DeleteTask }