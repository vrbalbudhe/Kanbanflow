const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const GetAllTasksByBoardId = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const FetchedChats = await prisma.chat.findMany({
               where: {
                    Task: {
                         boardId: boardId
                    }
               },
               distinct: ['taskId'],
               select: {
                    Task: {
                         select: {
                              id: true,
                              title: true,
                              description: true,
                              createdAt: true,
                              priority: true,
                              tags: true,
                              assigneeId: true,
                              boardId: true,
                         },
                    }
               }
          })
          if (!FetchedChats) {
               return res.status(404).json({
                    message: "Unable to Fetched all Chats",
                    success: false
               })
          }
          return res.status(200).json({
               message: "All Chats Fetched Successfully",
               success: true,
               chats: FetchedChats
          })
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          })
     }
})

module.exports = { GetAllTasksByBoardId }