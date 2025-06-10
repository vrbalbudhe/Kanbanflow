const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const AddTasks = asyncHandler(async (req, res) => {
     const { title, description, priority, assigneeId, boardId, columnId, tags } = req.body;

     if (!title || !boardId || !columnId) {
          return res.status(400).json({
               message: "All Parameters Are Required",
               success: false
          });
     }

     try {
          const NewTask = await prisma.task.create({
               data: {
                    title,
                    description,
                    priority,
                    assigneeId,
                    boardId,
                    columnId,
                    // tags: {
                    //      deleteMany: {},
                    //      create: tags?.map(tag => ({
                    //           title: tag.title,
                    //           src: tag.src || null
                    //      })) || []
                    // }
               },
               include: {
                    tags: true
               }
          });

          return res.status(201).json({
               message: "New Task Created Successfully",
               success: true,
               task: NewTask
          });
     } catch (error) {
          return res.status(500).json({
               message: "Server Error",
               success: false,
               error
          });
     }
});

module.exports = { AddTasks };
