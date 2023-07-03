const Sequelize = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt');

//유저의 닉네임, 등급정보만 넘겨주기
exports.Info = async(req,res,next) => {
    try{
        const userId = req.user.id;

        const userInfo = await User.findOne({
            where: {
                id:userId,
            },
        });

        if(!userInfo) {
            return res.status(404).json({ message: '해당 유저정보를 찾을 수 없습니다.'});
        }

        const { nickname, grade } = userInfo;

        res.json({
            nickname,
            grade,
        });

    } catch(error) {
        console.log(error);
        next(error);
    }
};

exports.checkPw = async(req,res,next) => {
    try{
        const user_pw = req.user.pw;
        const {pw} = req.body;

  
        //비밀번호 검사
    const compareResult = await bcrypt.compare(pw, user_pw);

    if(compareResult) {
        console.log(user_pw);
        console.log(pw);
      return res.status(200).json({message: '비밀번호가 확인되었습니다.'});
    } else {
        return res.status(400).json({message: '비밀번호가 일치하지 않습니다.'});
    }
    
    }catch(error) {
        console.log(error);
        next(error);
    }
};

//유저의 전체정보 넘겨주기
exports.userInfo = async(req,res,next) => {
    try{
        const userId = req.user.id;

        const userInfo = await User.findOne({
            where: {
                id:userId,
            },
        });

        if(!userInfo) {
            return res.status(404).json({ message: '해당 유저정보를 찾을 수 없습니다.'});
        }

        return res.json(userInfo);

    } catch(error) {
        console.log(error);
        next(error);
    }
};

exports.updateInfo = async(req,res,next) => {
    try{
        const userId = req.user.id; 
        const {nickname, pw, location} = req.body;

        const encryptedPassword = await bcrypt.hash(pw,12);

        await User.update({
            pw : encryptedPassword,
            nickname : nickname,
            location : location,
            },
            {
                where : {
                    id : userId
                },
            });
            res.json({message : '회원정보 수정이 완료되었습니다.'});
    }catch(error) {
        console.log(error);
        next(error);
    }
};