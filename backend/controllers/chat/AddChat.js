const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const AddChat = asyncHandler(async (req, res) => {
     const { taskId } = req.params;
     const { message, senderId } = req.body;
     try {
          if (!message || !senderId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const NewChat = await prisma.chat.create({
               data: {
                    message,
                    senderId,
                    taskId: taskId
               }
          })
          if (!NewChat) {
               return res.status(404).json({
                    message: "Unable to create the new chat",
                    success: false
               })
          }
          return res.status(200).json({
               message: "New Chat Created Successfully",
               success: true,
               chat: NewChat
          })
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          })
     }
})

module.exports = { AddChat }