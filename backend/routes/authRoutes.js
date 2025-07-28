const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post('/signUp',authController.signUp); //register route 
router.post('/login',authController.login); //login route 

module.exports = router;


//IMPROVEMENTS : ( ADDING PROFILE )
// // Protected profile route
// const authMiddleware = require("../middlewares/authMiddleware");
// router.get("/profile", authMiddleware, userController.getProfile);
