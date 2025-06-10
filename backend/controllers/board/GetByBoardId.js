const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");
const GetByBoardId = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "Board Id Is Required",
                    success: false
               })
          }
          const findBoard = await prisma.board.findUnique({
               where: {
                    id: boardId
               }
          })

          if (!findBoard) {
               return res.status(401).json({
                    message: "Unable to fetch the Board Information",
                    success: false
               })
          }
          return res.status(200).json({
               message: "Board Information Fetched Successfully.",
               success: true,
               board: findBoard
          })
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false
          })
     }
})

module.exports = {GetByBoardId}