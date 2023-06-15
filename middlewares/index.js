const passport = require('passport');
const jwt = require('jsonwebtoken');
const Notice = require('../models/notice');
const GroupTeam = require('../models/group_purchase_team');

exports.checkJwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        console.error(err);
        next(err);
      }
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ result: false });
      }
    })(req, res, next);
  };

  exports.noticeGp = async (req,res,next) => {
    try{
        const { gpId } = req.body;


        //GroupTeam에서 해당 group_id를 가진 user_id 조회
        const groupTeamUsers = await GroupTeam.findAll({
            where: { purchase_id : gpId },
            attributes: ['user_id'], 
        });

        const userIds = groupTeamUsers.map((user) => user.user_id);

        await Promise.all(
            userIds.map(async (userId) => {
                await Notice.create({
                    user_id: userId,
                    type: gpId,
                    content: '공동구매 매칭이 완료되었습니다!',
                });
            })
        );

        res.json({message: '공동구매 매칭 알람을 전송하였습니다!'});

    }catch(error) {
        console.log(error);
        next(error)
    }
  }