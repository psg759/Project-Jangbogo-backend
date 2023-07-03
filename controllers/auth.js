//꺼내온 객체에 함수를 직접구현(try-catch가 일반적 로직)
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache();  //in-memory cache
const User = require('../models/user');
const { sens } = require('../config/config');
const axios = require("axios");
const CryptoJS = require("crypto-js");
const sequelize = require('sequelize');

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
        cache.set(hp, verificationCode, 180);   //in-memory cache에 인증번호 저장(10분 동안 유효);
        
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
            "Content-type": "application/json; charset=utf-8",
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
        console.log(cachedVerificationCode);
        return res.status(400).send('인증번호가 일치하지 않습니다.');
    }

    console.log("성공");
    //인증에 성공하면 in-memory cache에서 해당 인증번호 삭제
    cache.del(hp);
    res.status(200).send('휴대폰번호 인증이 완료되었습니다.');
};

exports.checkNickname = async(req, res, next) => {
    const { nickname } = req.query;
    
    try {
        const duplicate = await User.findOne({ where: {nickname}});
        //닉네임이 존재하면 회원가입 페이지로 되돌려보내기
        if (duplicate) {
            return res.status(400).json({
                nickname: "중복된 닉네임입니다."
            })
        }
        res.status(200).send('닉네임이 확인되었습니다.');
    } catch (error) {
        console.log(error);
        console.log(encryptedPassword);
        next(error);
    }
};

exports.signUp = async(req, res, next) => {
    const {nickname, hp, pw, gender, location} = req.body;
    
    try {
        const encryptedPassword = await bcrypt.hash(pw, 12);
        const status = 0;
        const grade = 0;
        // 사용자 정보 저장
        await User.create({
            hp : hp,
            nickname : nickname,
            gender : gender,
            grade,
            location : location,
            pw : encryptedPassword,
            status,
        });

        res.status(200).send('회원가입이 완료되었습니다.');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.signIn = async (req, res, next) => {
    const {hp, pw} = req.body;
    try{
        //req.checkBody('hp', '핸드폰번호를 입력해주세요.').notEmpty();
        //req.checkBody('password', '패스워드를 입력해주세요.').notEmpty();
        passport.authenticate('local', {session:false}, async (passportError, user, info) => {
            //인증이 실패했거나 유저 데이터가 없다면 에러 발생
            if (passportError || !user) {
                res.status(400).json({ message: info.message });
                return;
            }
            //passport 내장 함수
            req.login(user, {session:false}, async (loginError) => {
                if (loginError) {
                    res.send(loginError);
                    return next(loginError);
                }
                const token = jwt.sign(
                    {
                        id: user.id,
                        hp: user.hp,
                        //name: user.nickname,
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn : '7d'
                    });
                    user.token = token;
                    await user.save();
                        // 토큰 값을 업데이트하는 SQL 쿼리 실행
                        // const query = `UPDATE users SET token = '${user.token}' WHERE hp = '${user.hp}';`;
                        // sequelize.query(query)
                        // .then(() => {
                        console.log('로그인성공');
                        //db에 token 저장한 후에 cookie에 토큰을 저장하여 이용자를 식별
                        res.cookie("auth", user.token, {
                            maxAge: 1000 * 60 * 60 * 24 * 7,    //7일간 유지
                            httpOnly: true,
                        })
                        res.status(200)
                        .json({ 
                            loginSucess: true, 
                            hp: user.hp,
                            id: user.id,
                            token: user.token 
                        });
                //     }).catch((updateError) => {
                //         console.error(updateError);
                //         return res.status(500).json({ error: '토큰 업데이트 중 오류가 발생했습니다.' });
                // });
            
        });
        })(req,res,next);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.signOut = async (req, res, next) => {
    try{
        const userId = req.user.id;

       const token = req.cookies.auth;

       //해당 사용자의 토큰을 null로 업데이트하여 무효화
       await User.update({ token: null }, {where: {id : userId}});

       res.clearCookie("auth");

       res.status(200).json({message : "로그아웃 되었습니다."});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.deleteAuth = async (req, res, next) => {
    try{
        const userId = req.user.id;

        await User.destroy({
            where: { id: userId },
        });

        res.status(200).json({message : "회원탈퇴가 되었습니다."});
    }catch(error) {
        console.log(error);
        next(error);
    }
};