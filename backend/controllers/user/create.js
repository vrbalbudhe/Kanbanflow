const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs");

const CreateUser = asyncHandler(async (req, res) => {
     const { username, email, password } = req.body;
     try {
          if (!username || !email || !password) {
               return res.status(200).json({
                    message: "All Parameters Are Required",
                    success: false
               })
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
               data: {
                    username,
                    email,
                    password: hashedPassword,
               }
          });

          if (!newUser) {
               return res.status(403).json({
                    message: "Unable to create User.",
                    success: false,
               });
          }
          return res.status(201).json({
               message: "User created successfully.",
               success: true,
               user: newUser
          });
     } catch (error) {
          return res.status(501).json({
               message: "Error While Creating the User.",
               success: false,
               error
          })
     }
})

module.exports = { CreateUser }