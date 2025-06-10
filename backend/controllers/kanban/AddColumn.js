const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const AddColumn = asyncHandler(async (req, res) => {
     const { name, colorCode, boardId, orderId } = req.body;
     try {
          if (!name || !colorCode || !boardId || !orderId) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const NewColumn = await prisma.column.create({
               data: {
                    name,
                    colorCode,
                    orderId,
                    boardId
               }
          })
          if (!NewColumn) {
               return res.status(404).json({
                    message: "Unable to create the new Column",
                    success: false
               })
          }
          return res.status(200).json({
               message: "New Column Created Successfully",
               success: true,
               column: NewColumn
          })
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          })
     }
})

module.exports = { AddColumn }