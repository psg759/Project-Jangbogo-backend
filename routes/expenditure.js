const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const { expendYear, expendMonth } = require('../controllers/expenditure');

const router = express.Router();


//메모 리스트 정보 가져오기(/memo)
router.get('/expendyear', checkJwt, expendYear);

//메모 정보 가져오기(/memo/memolist)
router.get('/expendmonth',checkJwt, expendMonth);

router.use(cors({
    credentials: true,
}))
module.exports = router;
