const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LoginUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body;

     try {
          if (!email || !password) {
               return res.status(200).json({
                    message: "All Parameters Are Required",
                    success: false
               });
          }

          const findUser = await prisma.user.findUnique({
               where: { email }
          });

          if (!findUser) {
               return res.status(403).json({
                    message: "Unable to find User.",
                    success: false,
               });
          }

          const passwordCheck = await bcrypt.compare(password, findUser.password);

          if (!passwordCheck) {
               return res.status(401).json({
                    message: "Incorrect Password.",
                    success: false,
               });
          }

          if (!process.env.JWT_SECRET) {
               return res.status(500).json({
                    message: "JWT_SECRET is not set in environment variables.",
                    success: false,
               });
          }

          const tokenData = {
               userId: findUser.id,
               email: findUser.email,
          };

          const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
               expiresIn: "7d",
          });

          const CookieOptions = {
               httpOnly: true,
               maxAge: 1000 * 60 * 240,
               sameSite: "Lax",
               secure: false,
               path: "/"
          };
          const { password: _, ...userInfo } = findUser;

          res.cookie("token", token, CookieOptions);

          return res.status(201).json({
               message: "User Logined successfully.",
               success: true,
               user: userInfo,
               token
          });

     } catch (error) {
          return res.status(500).json({
               message: "Error While Logging in the User.",
               success: false,
               error: error.message || error
          });
     }
});

module.exports = { LoginUser };
