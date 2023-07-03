const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const {refrigeList, refrigeItem, createItem, updateItem, deleteItem} = require('../controllers/refrigerator');

const router = express.Router();

//메모 리스트 정보 가져오기(/memo)
router.get('/refrigelist', checkJwt, refrigeList);

//메모 리스트 정보 가져오기(/memo)
router.get('/refrigeitem', checkJwt, refrigeItem);

//메모 정보 저장
router.post('/createitem',checkJwt, createItem);

 //메모 수정
router.put('/updateitem',checkJwt, updateItem);

 //메모 삭제
router.delete('/deleteitem',checkJwt, deleteItem);

router.use(cors({
    credentials: true,
}))
module.exports = router;
