const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const { pricePd } = require('../controllers/prediction');

const router = express.Router();

//가격예측 기능 실행하기
router.post('/pricepd', checkJwt, pricePd);

router.use(cors({
    credentials: true,
}))
module.exports = router;
