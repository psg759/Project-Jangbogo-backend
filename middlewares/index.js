const passport = require('passport');
const jwt = require('jsonwebtoken');
const Notice = require('../models/notice');
const User = require('../models/user');
const GroupTeam = require('../models/group_purchase_team');
const GroupOrganize = require('../models/group_purchase_organize');

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
        const { gpId } = req.query;


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
                    content: '참여자간 공동구매 매칭이 완료되었습니다!',
                    category:0,
                });
            })
        );

        await Promise.all(
            userIds.map(async (userId) => {
              const filtering = await GroupOrganize.count({
                include: [
                  {
                    model: GroupTeam,
                    required: true,
                    where: {
                      user_id: userId,
                    },
                    attributes: ['purchase_id'],
                  },
                ],
                where: {
                  status: 1,
                },
              });
          
              if (filtering >= 6 && filtering <= 10) {
                // user의 grade를 1로 변경
                await User.update({ grade: 1 }, { where: { id: userId } });
              } else if (filtering >= 11 && filtering <= 15) {
                // user의 grade를 2로 변경
                await User.update({ grade: 2 }, { where: { id: userId } });
              }
            })
          );
          
        res.status(200).json({ message: '사용자 등급 업데이트를 완료했습니다.' });

        res.status(200).json({message: '공동구매 매칭 알람을 전송하였습니다!'});

    }catch(error) {
        console.log(error);
        next(error)
    }
  };

  exports.tnoticeGp = async (req,res,next) => {
    try{
      const { gpId } = req.query;

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
                  content: '정원 미달이나 시간이 마감되어, 현 참여자들간 공동구매 매칭이 완료되었습니다!',
                  category:0,
              });
          })
      );

      await Promise.all(
        userIds.map(async (userId) => {
          const filtering = await GroupOrganize.count({
            include: [
              {
                model: GroupTeam,
                required: true,
                where: {
                  user_id: userId,
                },
                attributes: ['purchase_id'],
              },
            ],
            where: {
              status: 1,
            },
          });
      
          if (filtering >= 6 && filtering <= 10) {
            // user의 grade를 1로 변경
            await User.update({ grade: 1 }, { where: { id: userId } });
          } else if (filtering >= 11 && filtering <= 15) {
            // user의 grade를 2로 변경
            await User.update({ grade: 2 }, { where: { id: userId } });
          }
        })
      );
      
      res.status(200).json({ message: '사용자 등급 업데이트를 완료했습니다.' });
      
      res.status(200).json({message: '(timeout)공동구매 매칭 알람을 전송하였습니다!'});

  }catch(error) {
      console.log(error);
      next(error)
  }
  };

  exports.dnoticeGp = async (req,res,next) => {
    try{
        const { gpId } = req.query;

        //GroupTeam에서 해당 group_id를 가진 user_id 조회
        const groupTeamUsers = await GroupTeam.findAll({
            where: { purchase_id : gpId, author: 1 },
            attributes: ['user_id'], 
        });

        const name = await GroupOrganize.findByPk(gpId).name;

        const userIds = groupTeamUsers.map((user) => user.user_id);

        await Promise.all( userIds.map(async (userId) => {
                await Notice.create({
                    user_id: userId,
                    type: gpId,
                    content: `참여한 공동구매 글이 삭제 되었습니다!/(ㄒoㄒ)/~~`,
                    category:1,
                });
            })
        );

      await GroupTeam.destroy({
          where: { purchase_id: gpId },
      });

      await GroupOrganize.destroy({
          where: { id: gpId },
      });
  
        res.status(200).json({ message: '공동구매 글 삭제 공지가 완료되었습니다.'});

  } catch(error) {
    console.log(error);
    next(error);
  }
};