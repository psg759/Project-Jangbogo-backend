const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const {memoList, memoItem, recentMemo, createMemo, updateMemo, deleteMemo} = require('../controllers/memo');
//memoSingle, createMemo, updateMemo, deleteMemo
const router = express.Router();


//메모 리스트 정보 가져오기(/memo)
router.get('/memolist', checkJwt, memoList);

//메모 정보 가져오기(/memo/memolist)
router.get('/memolist/memoitem',checkJwt, memoItem);

router.get('/recentmemo', checkJwt, recentMemo);

//메모 정보 저장
router.post('/creatememo',checkJwt, createMemo);

 //메모 수정
router.post('/updatememo',checkJwt, updateMemo);

 //메모 삭제
router.delete('/deletememo',checkJwt, deleteMemo);

router.use(cors({
    credentials: true,
}))
module.exports = router;
