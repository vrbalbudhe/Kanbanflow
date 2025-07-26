const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const AddParticipants = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     const { email, permission, userAccess } = req.body;
     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               });
          }
          const existingParticipant = await prisma.participant.findFirst({
               where: {
                    email,
                    boardId,
               },
          });

          if (existingParticipant) {
               return res.status(409).json({
                    message: "Participant already added to this board",
                    success: false,
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
          console.error(error);
          return res.status(500).json({
               message: "Server error while creating participant",
               success: false,
          });
     }
});

module.exports = { AddParticipants }