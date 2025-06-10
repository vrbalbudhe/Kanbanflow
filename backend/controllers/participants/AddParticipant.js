const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const AddParticipants = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     const { email, permission, userAccess } = req.body;
     console.log(boardId)
     console.log(email)
     console.log(permission)
     console.log(userAccess)
     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               });
          }
          const NewParticipant = await prisma.participant.create({
               data: {
                    email,
                    userAccess,
                    permission,
                    boardId: boardId
               },
               include: {
                    Board: true
               }
          })
          if (!NewParticipant) {
               return res.status(404).json({
                    message: "Unable to create new participant",
                    success: false,
               });
          }
          return res.status(200).json({
               message: "New Participant Created Successfully",
               success: true,
               member: NewParticipant
          });

     } catch (error) {
          console.log(error)
     }
});

module.exports = { AddParticipants }