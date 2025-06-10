const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const DeleteColumn = asyncHandler(async (req, res) => {
     const { id } = req.params;
     try {
          if (!id) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const deleteColumn = await prisma.column.delete({
               where: {
                    id: id
               }
          })
          if (!deleteColumn) {
               return res.status(400).json({
                    message: `Unable to delete Column With ${id}`,
                    success: false
               })
          }
          return res.status(200).json({
               message: `Column With ${id} is Deleted Successfully`,
               success: true
          })
     } catch (error) {
          res.status(500).json({ error: "Internal server error" });
     }
})

module.exports = { DeleteColumn }