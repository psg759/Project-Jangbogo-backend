
const express = require('express');

const { isLoggedIn, isNotLoggedIn} = require('../middlewares');
const {sendSmsVerificationCode, verifySmsVerificationCode, signUp, signIn, signOut} = require('../controllers/auth');

const router = express.Router();

//휴대폰 번호 인증번호 생성
router.post('/send-verification-code', sendSmsVerificationCode);

//인증번호가 일치하는지 확인
router.post('/verify-verification-code', verifySmsVerificationCode);

//Post /auth/signup, 회원가입
router.post('/signup', signUp);

//Post /auth/signin
//router.post('/signin', isNotLoggedIn, signIn);

//Get /auth/signout
//router.get('/signout', isLoggedIn, signOut);



module.exports = router;