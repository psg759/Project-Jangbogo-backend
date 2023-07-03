const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const { Info, userInfo, checkPw, updateInfo  } = require('../controllers/mypage');
const {checkNickname} = require('../controllers/auth');
const { gpItem, myGpList, ppGpList, endGpList } = require('../controllers/grouppurchase');

const router = express.Router();


//처음 마이페이지 들어갔을 때 화면
router.get('/info', checkJwt, Info);

//비밀번호 확인
router.post('/checkpw', checkJwt, checkPw);

//유저 정보 불러오기
router.get('/userinfo',checkJwt, userInfo);

//닉네임 중복 체크 
router.get('/checknickname', checkNickname);

//유저 정보 수정하기 
router.put('/updateinfo',checkJwt, updateInfo);

//내가 작성한 공동구매 글 리스트 불러오기
router.get('/mygplist', checkJwt, myGpList);

//내가 작성한 공동구매 글 리스트 불러오기
router.get('/ppgplist', checkJwt, ppGpList);

//내가 작성한 공동구매 글 리스트 불러오기
router.get('/endgplist', checkJwt, endGpList);

//상세보기
router.get('/gpitem', checkJwt, gpItem);

router.use(cors({
    credentials: true,
}))
module.exports = router;
