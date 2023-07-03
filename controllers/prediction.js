const Sequelize = require('sequelize');
const { spawn } = require('child_process');
const path = require('path');

exports.pricePd = async(req,res,next) => {
try{
    const search = req.body;
    //파이썬 경로 설정
    const pythonFilePath = '/home/bitnami/Jangbogo-backend/Final/Code/crawling.py';

    //파이썬 파일 실행
    const pythonProcess = spawn('python3', [pythonFilePath]);
  
    // inputValue를 파이썬 프로세스의 표준 입력으로 전달
  console.log(search);
  pythonProcess.stdin.write(JSON.stringify(search));
  pythonProcess.stdin.end();
 

    // 파이썬 프로세스로부터의 데이터 이벤트 처리
    pythonProcess.stdout.on('data', function(data) {
        console.log(data);
        console.log(data.toString());
    });

    // 파이썬 프로세스 종료 이벤트 처리
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log("end");
        res.json({ result }); // 결과값을 JSON 형태로 응답
      } else {
        // 파이썬 프로세스 실행 중 오류 발생
        next(new Error('An error occurred while executing the Python script.'));
      }
    });

}catch(error) {
    console.log(error);
    next(error);
}
};