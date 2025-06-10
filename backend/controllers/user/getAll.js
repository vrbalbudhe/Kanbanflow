const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler")

const GetAll = asyncHandler(async (req, res) => {
     try {
          const allUsers = await prisma.user.findMany()
          if (!allUsers) {
               return res.status(403).json({
                    message: `Unable to find the users`,
                    success: false
               })
          }
          const { password, ...userWithoutPassword } = allUsers;
          return res.status(200).json({
               message: "Users Fetched Successfully",
               success: true,
               user: allUsers
          })
     } catch (error) {
          return res.status(501).json({
               message: "Unable to Process the GetAll Users",
               success: false
          })
     }
})

module.exports = { GetAll }