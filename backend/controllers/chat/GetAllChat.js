const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const GetAllChat = asyncHandler(async (req, res) => {
     const { taskId } = req.params;
     try {
          if (!taskId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const FetchedChats = await prisma.chat.findMany({
               where: {
                    taskId: taskId
               },
          })
          if (!FetchedChats) {
               return res.status(404).json({
                    message: "Unable to Fetched all Chats",
                    success: false
               })
          }
          return res.status(200).json({
               message: "Alll Chats Fetched Successfully",
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

module.exports = { GetAllChat }