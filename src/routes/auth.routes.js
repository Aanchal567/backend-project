const express=require('express');
const authController=require("../controllers/auth.controller")
const authMiddleware=require('../middlewares/auth.middleware')
const musicController=require("../controllers/music.controller")
const router =express.Router();
router.post('/register',authController.registerUser)
router.post('/login',authController.loginUser)
router.post('/logout',authController.logoutUser)
router.get("/",authMiddleware.authUser,musicController.getAllMusics)
router.get("/myProfile",authMiddleware.authAny,authController.myProfile);
module.exports=router; 