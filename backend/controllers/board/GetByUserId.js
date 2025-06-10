const prisma = require("../../lib/prisma");
const GetByUserId = async (req, res) => {
     const { id } = req.params;
     try {
          if (!id) {
               return res.status(400).json({
                    message: "Missing parameter: id",
                    success: false
               });
          }
          const boards = await prisma.board.findMany({
               where: {
                    userId: id
               }
          });
          if (!boards || boards.length === 0) {
               return res.status(404).json({
                    message: `No boards found for user id ${id}`,
                    success: false
               });
          }
          return res.status(200).json({
               message: "Boards fetched successfully",
               success: true,
               boards: boards
          });
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
     }
};

module.exports = { GetByUserId };