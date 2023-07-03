const TeachableMachine = require("@sashido/teachablemachine-node");
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

const model = new TeachableMachine({
  modelUrl: 'https://teachablemachine.withgoogle.com/models/mKfXFCNem/'
});

const upload = multer({ dest: 'uploads/' });

exports.ripenessImage = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).send('No image file found.');
    }

    const imagePath = path.join(__dirname, '../', image.path);

    // 이미지 변환
    await sharp(imagePath)
      .resize(224, 224)
      .toBuffer()
      .then((buffer) => {
        // 이미지 경로를 티처블 머신 모델에 전달하는 과정
        model.classify({
          image: buffer, // 수정: 이미지 데이터 전달
        }).then((predictions) => {
          console.log(predictions);
          return res.json(predictions);
        }).catch((e) => {
          console.error(e);
          res.status(500).send("Something went wrong!");
        });
      });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.uploadImage = upload.single('image');

exports.upLoad = async(req ,res) => {
  try {
    const file = req.file;
    if(!file) {
      return res.status(400).send("no image file found.");
    }

    //이미지 업로드 성공
    return res.status(200).send('Image uploaded successfully.');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
}