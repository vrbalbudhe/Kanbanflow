const prisma = require("../../lib/prisma");
const AddBoard = async (req, res) => {
     const { title, description, owner, status, userId } = req.body;
     try {
          if (!title || !description || !owner || !status || !userId) {
               return res.status(400).json({
                    message: "All Parameters Are Required.",
                    success: false
               })
          }
          const board = await prisma.board.create({
               data: {
                    title,
                    description,
                    owner,
                    status,
                    userId: userId
               }
          });
          if (!board) {
               return res.status(400).json({
                    message: "Error While Creating the Board",
                    success: "false"
               })
          }
          return res.status(201).json({
               message: "Board Created Successfully",
               success: true,
               Board: board
          })
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal server error" });
     }
};

module.exports = { AddBoard };