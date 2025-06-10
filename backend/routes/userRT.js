const express = require("express");
const { CreateUser } = require("../controllers/user/create");
const { LoginUser } = require("../controllers/user/login");
const { GetById } = require("../controllers/user/GetById");
const { GetAll } = require("../controllers/user/getAll");
const logout = require("../controllers/user/logout");
const TokenVerification = require("../controllers/verification/TokenVerification");
const router = express.Router();

// USER TOKEN VERIFICATION
router.get("/isToken", TokenVerification);

// User Routes
router.post("/create", CreateUser);
router.get("/all", GetAll);
router.post("/login", LoginUser);
router.post("/logout", logout);
router.get("/get/id/:id", GetById)

module.exports = router;