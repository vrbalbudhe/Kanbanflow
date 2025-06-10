const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const GetAllParticipants = asyncHandler(async (req, res) => {
     const { boardId } = req.params;

     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               });
          }
          const participants = await prisma.participant.findMany({
               where: {
                    boardId: boardId
               }
          })
          if (!participants) {
               return res.status(404).json({
                    message: "Unable to fetch all the participants",
                    success: false,
               });
          }
          return res.status(200).json({
               message: "All Members Fetched Successfully",
               success: true,
               members: participants
          });

     } catch (error) {

     }
});

module.exports = { GetAllParticipants }