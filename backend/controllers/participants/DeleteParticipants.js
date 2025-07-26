const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const DeleteParticipants = asyncHandler(async (req, res) => {
     const { participantsId } = req.params;
     try {
          if (!participantsId) {
               return res.status(400).json({
                    message: "Participant-Id Is Required",
                    success: false
               });
          }
          const findParticipant = await prisma.participant.findUnique({
               where: {
                    id: participantsId,
               }
          })
          if (!findParticipant) {
               return res.status(404).json({
                    message: "Unable to find any participant",
                    success: false,
               });
          }

          await prisma.participant.delete({
               where: {
                    id: participantsId,
               }
          })

          return res.status(200).json({
               message: "Participant deleted Successfully!",
               success: true
          })

     } catch (error) {
          return res.status(500).json({
               message: "Server error while deleting participant",
               success: false,
          });
     }
})

module.exports = { DeleteParticipants }