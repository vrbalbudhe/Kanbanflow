const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const GetAllByBoardId = asyncHandler(async (req, res) => {
     const { boardId } = req.params;
     try {
          if (!boardId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const FetchedColumns = await prisma.column.findMany({
               where: {
                    boardId: boardId
               },
               include: {
                    Task: {
                         include: {
                              tags: true 
                         }
                    }
               }

          })
          if (!FetchedColumns) {
               return res.status(404).json({
                    message: "Unable to Fetched all Columns",
                    success: false
               })
          }
          return res.status(200).json({
               message: "Alll Columns Fetched Successfully",
               success: true,
               columns: FetchedColumns
          })
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          })
     }
})

module.exports = { GetAllByBoardId }