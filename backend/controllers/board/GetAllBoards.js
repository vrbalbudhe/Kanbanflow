const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");
const GetAllBoards = asyncHandler(async (req, res) => {
     try {
          const AllBoards = await prisma.board.findMany(
               {
                    include: {
                         participants: true
                    }
               }
          )

          if (!AllBoards) {
               return res.status(401).json({
                    message: "Unable to fetch the All Boards",
                    success: false
               })
          }
          return res.status(200).json({
               message: "Boards Information Fetched Successfully.",
               success: true,
               boards: AllBoards
          })
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false
          })
     }
})

module.exports = { GetAllBoards }