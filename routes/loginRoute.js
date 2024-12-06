import express from "express";
import { signUp ,loginUser, requesOtp, logOut,verifyOtp ,updatePassword ,verifyOtpAndRegister } from "../controllers/loginController.js";
const router = express.Router();

router.get('/sign-up', (req,res) =>{
    res.render('sign-up')
})
router.post('/sign-up', signUp)
router.get('/ac-verification',(req,res) =>{
    res.render('ac-verification')
})
router.post('/ac-verification',verifyOtpAndRegister)

router.get('/login',(req,res) =>{
    // const previousUrl = req.headers.referer || '/'; 
    // req.session.redirectTo = previousUrl; 
    res.render('login')
})
router.get('/forget-password',(req,res)=>{
    res.render('forget-password')
})
router.post('/request-otp', requesOtp)

router.get('/verify-otp',(req,res)=>{
    res.render('verify-otp')
})
router.post('/verify-otp',verifyOtp)

router.get('/update-password',(req,res) =>{
    res.render('update-password')
})
router.post('/update-password',updatePassword)

router.post('/login', loginUser)
router.get('/logout',logOut)

export default router