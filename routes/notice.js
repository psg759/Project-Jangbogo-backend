const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const { gpItem } = require('../controllers/grouppurchase');
const { noticeList, noticeItem } = require('../controllers/notice');

const router = express.Router();


//공동구매 리스트 정보 가져오기(위치 주소 포함)
router.get('/noticelist', checkJwt, noticeList);

//공동구매 성사 됐을 경우 글 정보 이어지게
router.get('/noticeitem', checkJwt, gpItem);

router.use(cors({
    credentials: true,
}))
module.exports = router;
