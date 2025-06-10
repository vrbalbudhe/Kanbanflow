const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const UpdateParticipant = asyncHandler(async (req, res) => {
     const { participantId } = req.params;
     const {
          permission,
          userAccess
     } = req.body;

     try {
          if (!participantId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               });
          }

          const existingParticipant = await prisma.participant.findFirst({
               where: {
                    id: participantId,
               }
          });

          if (!existingParticipant) {
               return res.status(404).json({
                    message: "Participant not found in this board",
                    success: false
               });
          }

          const updateData = {};
          if (permission !== undefined) updateData.permission = permission;
          if (userAccess !== undefined) updateData.userAccess = userAccess;

          const updatedParticipantDetails = await prisma.participant.update({
               where: {
                    id: participantId
               },
               data: updateData,
          });

          return res.status(200).json({
               message: `Participant Details updated successfully`,
               success: true,
               participant: updatedParticipantDetails
          });

     } catch (error) {
          console.error("=== PRISMA ERROR ===");
          console.error("Error message:", error.message);
          console.error("Full error:", error);

          res.status(500).json({
               error: "Internal server error",
               details: error.message,
               success: false
          });
     }
});

module.exports = { UpdateParticipant };