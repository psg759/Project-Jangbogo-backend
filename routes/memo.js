const express = require('express');
const {checkJwt} = require('../middlewares/index');
const {memoList, memoItem, createMemo, updateMemo, deleteMemo} = require('../controllers/memo');
//memoSingle, createMemo, updateMemo, deleteMemo
const router = express.Router();

//메모 리스트 정보 가져오기(/memo)
router.get('/memolist', checkJwt, memoList);

//메모 정보 가져오기(/memo/memolist)
router.get('/memolist/memoitem',checkJwt, memoItem);

//메모 정보 저장
router.post('/creatememo',checkJwt, createMemo);

 //메모 수정
router.post('/updatememo',checkJwt, updateMemo);

 //메모 삭제
router.delete('/deletememo',checkJwt, deleteMemo);

module.exports = router;