const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler")

const UserBoardCheck = asyncHandler(async (req, res) => {
     const { userEmail, boardId } = req.body;
     try {
          if (!userEmail || !boardId?.id) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               });
          }

          const existingBoard = await prisma.board.findUnique({
               where: {
                    id: boardId?.id
               }
          })

          if (!existingBoard) {
               return res.status(404).json({
                    message: "Unable to find the Board With Given Id",
                    success: false,
               });
          }

          const checkUserAuthorization = await prisma.participant.findFirst({
               where: {
                    email: userEmail,
                    boardId: boardId?.id
               }
          })

          return res.status(200).json({
               message: `User-${userEmail} Is ${checkUserAuthorization ? "" : "Not"} Authorized to access the Board-${boardId?.id}`,
               toastMessage: checkUserAuthorization ? `User Right Authorized!` : `User Right Denied`,
               success: checkUserAuthorization ? true : false,
          });
     } catch (error) {
          return res.status(500).json({
               message: "Server Unable to Check User(Participant) Authorization to the Board",
               success: false,
          });
     }
})

module.exports = { UserBoardCheck }