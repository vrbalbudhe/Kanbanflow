const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const DeleteBoard = asyncHandler(async (req, res) => {
     const { id } = req.params;
     try {
          if (!id) {
               return res.status(400).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const deleteBoard = await prisma.board.delete({
               where: {
                    id: id
               }
          })
          if (!deleteBoard) {
               return res.status(400).json({
                    message: `Unable to delete Board With ${id}`,
                    success: false
               })
          }
          return res.status(200).json({
               message: `Board With ${id} is Deleted Successfully`,
               success: true
          })
     } catch (error) {
          res.status(500).json({ error: "Internal server error" });
     }
})

module.exports = { DeleteBoard }