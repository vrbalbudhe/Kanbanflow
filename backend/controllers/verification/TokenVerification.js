const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const TokenVerification = asyncHandler(async (req, res) => {
     const token = req.cookies?.token;

     if (!token) {
          return res.status(401).json({
               message: "User is Not Authenticated",
               success: false,
          });
     }

     try {
          const payload = jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret");
          req.userId = payload.id || payload.userId;

          return res.status(200).json({
               message: "User Info Fetched Successfully || User is Logged In",
               payload,
          });

     } catch (error) {
          console.log(error);
          return res.status(401).json({
               message: "Invalid Token",
               success: false,
          });
     }
});

module.exports = TokenVerification;
