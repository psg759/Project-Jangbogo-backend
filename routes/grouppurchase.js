const express = require('express');
const cors = require('cors');
const {checkJwt, noticeGp, dnoticeGp, tnoticeGp} = require('../middlewares/index');
const { createGp, updateGp, deleteGp, gpList, searchGpList, participateGp,dparticipateGp, timeoutGp, gpItem } = require('../controllers/grouppurchase');

const router = express.Router();


//공동구매 리스트 정보 가져오기(위치 주소 포함)
router.get('/gplist', checkJwt, gpList);

//공동구매 검색 리스트 정보 가져오기(위치 주소 포함)
router.get('/searchgplist',checkJwt, searchGpList);

//공동구매 글 정보 불러오기
router.get('/gpitem', checkJwt, gpItem);

//공동구매 참여하기
router.post('/participategp', checkJwt, participateGp, noticeGp);

//공동구매 참여 취소하기
router.delete('/dparticipategp', checkJwt, dparticipateGp);

router.post('/timeoutgp', checkJwt, timeoutGp, tnoticeGp);

//공동구매 글 등록하기
router.post('/creategp', checkJwt, createGp);

//공동구매 글 수정하기 
router.put('/updategp',checkJwt, updateGp);

//공동구매 글 삭제하기
router.delete('/deletegp',checkJwt, deleteGp, dnoticeGp);

router.use(cors({
    credentials: true,
}))
module.exports = router;
