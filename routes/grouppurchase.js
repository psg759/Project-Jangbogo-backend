const express = require('express');
const cors = require('cors');
const {checkJwt, noticeGp} = require('../middlewares/index');
const { createGp, gpList, searchGpList, participateGp, gpItem } = require('../controllers/grouppurchase');

const router = express.Router();


//공동구매 리스트 정보 가져오기(위치 주소 포함)
router.get('/gplist', checkJwt, gpList);

// //공동구매 검색 리스트 정보 가져오기(위치 주소 포함)
router.get('/searchgplist',checkJwt, searchGpList);

// //공동구매 글 정보 불러오기
router.get('/gpitem', checkJwt, gpItem);

router.post('/participategp', checkJwt, participateGp, noticeGp);

//공동구매 글 등록하기
router.post('/creategp', checkJwt, createGp);

// //공동구매 글 수정하기 
// router.post('/updategp',checkJwt, updateGp);

// //공동구매 글 삭제하기
// router.delete('/deletegp',checkJwt, deleteGp);

router.use(cors({
    credentials: true,
}))
module.exports = router;
