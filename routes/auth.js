const cors = require('cors');
const express = require('express');
const {sendSmsVerificationCode, verifySmsVerificationCode, signUp, signIn, checkJwt, signOut} = require('../controllers/auth');

const router = express.Router();

router.use(express.json())


//휴대폰 번호 인증번호 생성
router.post('/send-verification-code', sendSmsVerificationCode);

//인증번호가 일치하는지 확인
router.post('/verify-verification-code', verifySmsVerificationCode);

//Post /auth/signup, 회원가입
router.post('/signup', signUp);

//Post /auth/signin
router.post('/signin', signIn);

//Get /auth/signout
//router.get('/signout', isLoggedIn, signOut);


router.use(cors({
    credentials: true,
}))
module.exports = router;
