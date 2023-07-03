const cors = require('cors');
const express = require('express');
const {checkJwt} = require('../middlewares/index');
const {sendSmsVerificationCode, verifySmsVerificationCode, signUp, signIn, signOut, deleteAuth, checkNickname} = require('../controllers/auth');

const router = express.Router();

router.use(express.json())


//휴대폰 번호 인증번호 생성
router.post('/send-verification-code', sendSmsVerificationCode);

//인증번호가 일치하는지 확인
router.post('/verify-verification-code', verifySmsVerificationCode);

router.get('/checknickname', checkNickname);

//Post /auth/signup, 회원가입
router.post('/signup', signUp);

//Post /auth/signin
router.post('/signin', signIn);

//POST /auth/signout
router.post('/signout', checkJwt, signOut);

//DELET /auth/deleteauth
router.delete('/deleteauth', checkJwt, deleteAuth);

router.use(cors({
    credentials: true,
}))
module.exports = router;
