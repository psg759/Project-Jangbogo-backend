const passport = require('passport');
const {Strategy : LocalStrategy} = require('passport-local');
//const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const {ExtractJwt, Strategy: JWTStrategy} = require('passport-jwt')
require('dotenv').config();

//passport가 읽을 사용자의 hp와 pw를 확인하는 옵션
const passportConfig = { usernameField: 'hp', passwordField: 'pw'};

//사용자 인증정보를 확인하는 함수
//인증 결과를 호출할 done 함수를 인자로 받음
//done에 들어가는 인자 : 서버에서 발생한 에러, 성공했을때 반환값, 인증 실패 이유
const passportVerify = async(hp, pw, done) => {
  try{
    const user = await User.findOne({where: {hp:hp}});
    //hp가 db에 존재하는지 확인
    if(!user) {
      done(null, false, { message: '존재하지 않는 사용자 입니다.'});
      return;
    }
    //비밀번호 검사
    const compareResult = await bcrypt.compare(pw, user.pw);

    if(compareResult) {
      done(null, user);
      return;
    }
 
    done(null, false, { message: '올바르지 않은 비밀번호 입니다.'});
  }catch (error) {
    console.error(error);
    done(error);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const JWTVerify = async(jwtPayload, done) => {
  try{
    const user = await User.findOne({where: {hp: jwtPayload.hp, id: jwtPayload.id}});
    //jwtPayload에 유저 정보가 담겨있다.
    //해당 정보로 유저 식별 로직을 거친다.
    //유효한 유저라면
    if (user) {
      const { location } = user;
      user.location = location;
      done(null, user);
      return;
    }
    //유효한 유저가 아니라면
    done(null, false, { reason: "올바르지 않은 인증정보 입니다."});
  } catch (error) {
    console.error(error);
    done(error)
  }
};

module.exports = () => {
  //local strategy
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};