const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const UpdateTask = asyncHandler(async (req, res) => {
     const { taskId } = req.params;
     const { title, description, priority, assigneeId, boardId, columnId, tags } = req.body;

     try {
          if (!taskId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }

          // Build the update data object
          const updateData = {
               title,
               description,
               priority,
               assigneeId,
          };

          // Only include boardId and columnId if they're provided
          if (boardId) updateData.boardId = boardId;
          if (columnId) updateData.columnId = columnId;

          // Handle tags as a relation - replace all existing tags
          if (tags && Array.isArray(tags)) {
               updateData.tags = {
                    deleteMany: {}, // Remove all existing tags for this task
                    create: tags.map(tag => ({
                         title: tag.title,
                         src: tag.src || null
                         // Don't include id or taskId - Prisma handles these
                    }))
               };
          }

          const updatedTask = await prisma.task.update({
               where: {
                    id: taskId
               },
               data: updateData,
               include: {
                    tags: true,
                    board: true,
                    column: true
               }
          });

          return res.status(200).json({
               message: `Task With ${taskId} is Updated Successfully`,
               success: true,
               task: updatedTask
          })
     } catch (error) {
          console.error("=== PRISMA ERROR ===");
          console.error("Error message:", error.message);
          console.error("Full error:", error);

          res.status(500).json({
               error: "Internal server error",
               details: error.message
          });
     }
})

module.exports = { UpdateTask }