const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler")

const GetById = asyncHandler(async (req, res) => {
     try {
          const { id } = req.params;
          if (!id) {
               return res.status(403).json({
                    message: "Id Parameters are missing",
                    success: false
               })
          }
          const findUser = await prisma.user.findUnique({
               where: {
                    id: id
               }
          })
          if (!findUser) {
               return res.status(403).json({
                    message: `Unable to find the user with ${id}`,
                    success: false
               })
          }
          const { password, ...userWithoutPassword } = findUser;
          return res.status(200).json({
               message: "User Fetched Successfully",
               success: true,
               user: findUser
          })
     } catch (error) {
          return res.status(501).json({
               message: "Unable to Process the GetUserById",
               success: false
          })
     }
})

module.exports = { GetById }