const express = require('express');
const cors = require('cors');
const {checkJwt} = require('../middlewares/index');
const { ripenessImage, upLoad } = require('../controllers/ripeness');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

//후숙도 사진 post
router.get('/image',checkJwt, ripenessImage);

router.post('/rimage',checkJwt, ripenessImage);

router.post('/upload', upload.single('image'), upLoad);
router.use(cors({
    credentials: true,
}))
module.exports = router;
