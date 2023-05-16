//꺼내온 객체에 함수를 직접구현(try-catch가 일반적 로직)
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const NodeCache = require('node-cache');
const cache = new NodeCache();  //in-memory cache
const User = require('../models/user');
const { sens } = require('../config/config');
const axios = require("axios");
const CryptoJS = require("crypto-js");

//휴대폰 인증번호 생성 및 전송
exports.sendSmsVerificationCode = async(req, res,next) => {
    try {
        const {hp} = req.body;
        const exUser = await User.findOne({ where: {hp}});
        const date = Date.now().toString();
        //핸드폰 번호가 존재하면 회원가입 페이지로 되돌려보내기
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        //없다면 핸드폰번호와 인증번호 만들어서 sms 문자로 인증번호 전송하기
        //환경변수
        const sens_service_id = sens.serviceId;
        const sens_access_key = sens.accessKey;
        const sens_secret_key = sens.secretKey;
        const sens_call_number = sens.callNumber;
        
        const verificationCode = Math.floor(1000 + Math.random() * 9000); // 4자리 인증번호 생성    
        cache.set(hp, verificationCode, 300);   //in-memory cache에 인증번호 저장(5분 동안 유효);
        
            // url 관련 변수 선언
        const method = "POST";
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
        const url2 = `/sms/v2/services/${sens_service_id}/messages`;

        // signature 작성 : crypto-js 모듈을 이용하여 암호화
        console.log(1);
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
        console.log(2);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        console.log(sens_access_key);
        hmac.update(sens_access_key);
        const hash = hmac.finalize();
        console.log(4);
        const signature = hash.toString(CryptoJS.enc.Base64);
        console.log(5);

        // sens 서버로 요청 전송
        const smsRes = await axios({
            method: method,
            url: url,
            headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": sens_access_key,
            "x-ncp-apigw-timestamp": date
            ,
            "x-ncp-apigw-signature-v2": signature,
            },
            data: {
            type: "SMS",
            countryCode: "82",
            from: sens_call_number,
            content: `[장보고] 인증번호는 [${verificationCode}] 입니다.`,
            messages: [{ to: `${hp}` }],
            },
        });
        console.log("response", smsRes.data);
        return res.status(200).json({ message: "SMS sent" });
        } catch (error) {
            console.error(error);
            return res.status(404).json({message : "SMS not sent"});
            }
};

exports.verifySmsVerificationCode = async (req, res,next) => {
    const {hp, verificationCode} = req.body;

    //in-memory cache에서 해당 핸드폰 번호의 인증번호 가져오기
    const cachedVerificationCode = cache.get(hp);

    if(!cachedVerificationCode) {
        //인증번호가 캐시에 없으면 실패 처리
        return res.status(400).send('유효하지 않은 인증번호입니다.');
    }

    if(cachedVerificationCode !== verificationCode) {
        //인증번호가 일치하지 않으면 실패 처리
        return res.status(400).send('인증번호가 일치하지 않습니다.');
    }

    console.log("성공");
    //인증에 성공하면 in-memory cache에서 해당 인증번호 삭제
    cache.del(hp);
    res.status(200).send('휴대폰번호 인증이 완료되었습니다.');
};

exports.signUp = async(req, res, next) => {
    const {hp, nickname, gender, location, password} = req.body;
    try {
        const duplicate = await User.findOne({ where: {nickname}});
        //닉네임이 존재하면 회원가입 페이지로 되돌려보내기
        if (duplicate) {
            return res.redirect('/join?error=exist');
        }
        const encryptedPassword = await bcrypt.hash(password, 12);

        // 사용자 정보 저장
        await User.create({
            hp,
            nickname,
            gender,
            location,
            password : encryptedPassword,
        });

        res.status(200).send('회원가입이 완료되었습니다.');
    } catch (error) {
        next(error);
    }
}