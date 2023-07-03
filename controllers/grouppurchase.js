const Sequelize = require('sequelize');
const User = require('../models/user');
const GroupOrganize = require('../models/group_purchase_organize');
const GroupTeam = require('../models/group_purchase_team');
const Notice = require('../models/notice');
const moment = require('moment');

const { Op } = Sequelize;

exports.gpList = async(req,res,next) => {
    try{
        const userLocation = req.user.location;

        const groupOrganize = await GroupOrganize.findAll({
            where: {
                place: userLocation,
                status: 0,
            },
            order: [['id', 'DESC']], // ID를 기준으로 내림차순 정렬
        });

        if(!groupOrganize) {
            return res.status(404).json({ message: '일치하는 공동구매 리스트가 존재하지 않습니다. '});
        }

        const gpList = await Promise.all(
            groupOrganize.map(async (organize) => {
                const { id, name, deadline_hour, deadline_min, peoplenum, createdAt } = organize;

                const participantsCount = await GroupTeam.count({
                    where: { purchase_id: id },
                });

                // endTime 계산
                const createdTime = moment(createdAt).add(deadline_hour, 'hours').add(deadline_min, 'minutes');

                const endTime = createdTime.format('YYYY-MM-DD HH:mm:ss');

                return {
                    id,
                    name,
                    deadline_hour,
                    deadline_min,
                    peoplenum,
                    participantsCount,
                    createdAt,
                    endTime,
                };
            })
        )
        res.json({userLocation, gpList});
    }catch(error) {
        next(error);
    }
};

exports.myGpList = async(req,res,next) => {
    try{
    const userId = req.user.id;

    const mygroupOrganizeList = await GroupOrganize.findAll({
        include: [
            {
              model: GroupTeam,
              required: true,
              where: {
                user_id: userId,
                author: 0,
              },
              attributes: ['purchase_id'],
            },
          ],
          where: {
            status: 0,
          },
          order: [['id', 'DESC']],
    });

    if (!mygroupOrganizeList) {
      return res.status(404).json({ message: '일치하는 공동구매 리스트가 존재하지 않습니다. '});
    }

    const formattedList = await Promise.all(
        mygroupOrganizeList.map(async (organize) => {
      const { id, name, deadline_hour, deadline_min, peoplenum, createdAt } = organize;

      //현재 참여자 계산
      const participantsCount = await GroupTeam.count({
        where: { purchase_id: id },
    });
      // endTime 계산
      const createdTime = moment(createdAt).add(deadline_hour, 'hours').add(deadline_min, 'minutes');
      const endTime = createdTime.format('YYYY-MM-DD HH:mm:ss');

      return {
        id,
        name,
        peoplenum,
        participantsCount,
        endTime,
            };
        })
    )
    res.json(formattedList);
} catch(error) {
    console.log(error);
    next(error);
}
};

exports.ppGpList = async(req,res,next) => {
    try{
    const userId = req.user.id;

    const ppgroupOrganizeList = await GroupOrganize.findAll({
        include: [
            {
              model: GroupTeam,
              required: true,
              where: {
                user_id: userId,
                author: 1,
              },
              attributes: ['purchase_id'],
            },
          ],
          where: {
            status: 0,
          },
          order: [['id', 'DESC']],
    });

    if (!ppgroupOrganizeList) {
      return res.status(404).json({ message: '일치하는 공동구매 리스트가 존재하지 않습니다. '});
    }

    const formattedList = await Promise.all(
        ppgroupOrganizeList.map(async (organize) => {
      const { id, name, deadline_hour, deadline_min, peoplenum, createdAt } = organize;

      //현재 참여자 계산
      const participantsCount = await GroupTeam.count({
        where: { purchase_id: id },
    });
      // endTime 계산
      const createdTime = moment(createdAt).add(deadline_hour, 'hours').add(deadline_min, 'minutes');
      const endTime = createdTime.format('YYYY-MM-DD HH:mm:ss');

      return {
        id,
        name,
        peoplenum,
        participantsCount,
        endTime,
            };
        })
    )
    res.json(formattedList);
} catch(error) {
    console.log(error);
    next(error);
}
};

exports.endGpList = async(req,res,next) => {
    try{
        const userId = req.user.id;
    
        const endgroupOrganizeList = await GroupOrganize.findAll({
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
              order: [['id', 'DESC']],
        });
    
        if (!endgroupOrganizeList) {
          return res.status(404).json({ message: '일치하는 공동구매 리스트가 존재하지 않습니다. '});
        }
    
        const formattedList = await Promise.all(
            endgroupOrganizeList.map(async (organize) => {
          const { id, name, deadline_hour, deadline_min, peoplenum, createdAt } = organize;
    
          //현재 참여자 계산
          const participantsCount = await GroupTeam.count({
            where: { purchase_id: id },
        });
          // endTime 계산
          const createdTime = moment(createdAt).add(deadline_hour, 'hours').add(deadline_min, 'minutes');
          const endTime = createdTime.format('YYYY-MM-DD HH:mm:ss');
    
          return {
            id,
            name,
            peoplenum,
            participantsCount,
            endTime,
                };
            })
        )
        res.json(formattedList);
    } catch(error) {
        console.log(error);
        next(error);
    }
};

exports.searchGpList = async(req,res,next) => {
    try{
        const userLocation = req.user.location;
        const { name } = req.query;

        const groupSOrganize = await GroupOrganize.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${ name }%`,
                  },
                place: userLocation,
                status: 0,
            },
            order: [['id', 'DESC']], // ID를 기준으로 내림차순 정렬
        });

        if(!groupSOrganize) {
            return res.status(404).json({ message: '일치하는 공동구매 리스트가 존재하지 않습니다. '});
        }

        const gpSearchList = await Promise.all(
            groupSOrganize.map(async (organize) => {
                const { id, name, deadline_hour, deadline_min, peoplenum, createdAt } = organize;

                const participantsCount = await GroupTeam.count({
                    where: { purchase_id: id },
                });

                // endTime 계산
                const createdTime = moment(createdAt).add(deadline_hour, 'hours').add(deadline_min, 'minutes');

                const endTime = createdTime.format('YYYY-MM-DD HH:mm:ss');

                return {
                    id,
                    name,
                    deadline_hour,
                    deadline_min,
                    peoplenum,
                    participantsCount,
                    createdAt,
                    endTime,
                };
            })
        )
        res.json({userLocation, gpSearchList});
    }catch(error) {
        next(error);
    }
};

exports.participateGp = async(req, res, next) => {
    try{
        const fk_user_id_memo = req.user.id;
        const { gpId } = req.query;

        const participateGroup = await GroupTeam.create({
            author: 1,
            isFullGB: 0,
            purchase_id : gpId,
            user_id: fk_user_id_memo,
        });

        //공동구매 글의 참여자 수 조회
        const participantsCnt = await GroupTeam.count({
            where: {purchase_id: gpId},
        });

        //공동구매 글의 모집 인원 수 조회
        const groupOrganize = await GroupOrganize.findByPk(gpId);
        const { peoplenum } = groupOrganize;

        //현재 참여자 수랑 비교해서 다 찼으면 DB 상태 업데이트 해주기
        if (participantsCnt === peoplenum) {
            await groupOrganize.update({ status : 1});
            await participateGroup.update({ isFullGB: 1});
        }

        if(participateGroup.isFullGB){
            res.json({ message: '공동구매에 성공적으로 참여하였습니다.'});
            next();
        } else {
            res.json({ message: '공동구매에 성공적으로 참여하였습니다.'});
        }
    }catch(error){
        next(error)
    }
};

exports.dparticipateGp = async(req,res,next) => {
    const userId = req.user.id;
    const { gpId } = req.query;

    await GroupTeam.destroy({
        where: { purchase_id: gpId, user_id: userId },
    });

    res.json({ message: '공동구매 참여가 취소되었습니다'});
};

exports.timeoutGp = async(req, res, next) => {
    try{
        const { gpId } = req.query;

        //GroupTeam 테이블에서 해당 gpId에 author가 1인 user_id 가 존재하는지 확인
        const participantsExists = await GroupTeam.findOne({
            where: { purchase_id: gpId, author: 1 },
        });

        const groupOrganize = await GroupOrganize.findByPk(gpId);

        //참여자가 존재한다면, 그냥 성사시키기
        if (participantsExists) {
            await groupOrganize.update({ status : 1});
            return next();
        }

        const creater = await GroupTeam.findOne({
            where: { purchase_id: gpId, author: 0 },
        });

        const userId = creater.user_id;

        await Notice.create({
            user_id: userId,
            type: gpId,
            content: '시간이 마감되었으나, 참여자가 없어 글이 삭제되었습니다.',
            category:1,
        });

        await GroupTeam.destroy({
            where: { purchase_id: gpId },
        });

        await GroupOrganize.destroy({
            where: { id: gpId },
        });

        return res.json({ message: '작성자에게 공지 완료하고, 성공적으로 게시글 삭제하였습니다.'});

    }catch(error){
        next(error)
    }
};

exports.gpItem = async (req, res, next) => {
    try {
        const { gpId } = req.query;
        const userId = req.user.id;

        //GroupTeam 테이블에서 해당 groupId와 userId를 조회
        const researchGp = await GroupTeam.findOne({
            where: {purchase_id: gpId, user_id: userId},
        });

        //권한 초기값 설정(없으면 null 리턴)
        let authorization = null;

        if (researchGp) {
            authorization = researchGp.getDataValue('author');
        }

        //GroupOrganize 테이블에서 해당 groupId로 검색
        const groupOrganization = await GroupOrganize.findOne({ where: { id: gpId } });

        if(!groupOrganization) {
            return res.status(404).json({ message: '해당 공동구매 글을 찾을 수 없습니다.'});
        }

        const participantCount = await GroupTeam.count({ where: {purchase_id: gpId} });

        //필요한 정보 추출해서 리턴
        const { name, kakaoadd, peoplenum, place, content, createdAt, deadline_hour, deadline_min, fk_user_id_organize} = groupOrganization;

        //작성자 정보도 조회하기
        const user_inform = await User.findOne({where: {id: fk_user_id_organize}})
        const { nickname, grade } = user_inform;

        // endTime 계산
        const createdTime = moment(createdAt).add(deadline_hour, 'hours').add(deadline_min, 'minutes');

        const endTime = createdTime.format('YYYY-MM-DD HH:mm:ss');

        res.json({
            authorization,
            gpId,
            name,
            kakaoadd,
            peoplenum,
            participantCount,
            deadline_hour,
            deadline_min,
            place,
            content,
            endTime,
            nickname,
            grade,
        });
    } catch (error) {
        next(error);
    }
};

exports.createGp = async(req,res,next) => {
    try{
        const fk_user_id_gp = req.user.id
        const { name, kakaoadd, peoplenum, deadline_hour, deadline_min, place, content } = req.body;
        const author = 0;   //생성자 권한 0
        const isFullGB = 0; //초기에는 모집 미완이니까 0
        const status = 0;
        const createdGroup = await GroupOrganize.create({
            name,
            kakaoadd,
            peoplenum,
            deadline_hour,
            deadline_min,
            place,
            content,
            status,
            fk_user_id_organize : fk_user_id_gp,
        });

        //group_team 테이블에 그룹참여정보 추가
        const participateGroup = await GroupTeam.create({
            author,
            isFullGB,
            purchase_id: createdGroup.id,
            user_id: fk_user_id_gp,
        });

        res.json({ message: '공동구매 글이 성공적으로 등록되었습니다.'});

    } catch(error){
        console.log(error);
        next(error);
    }
};

exports.updateGp = async(req,res,next) => {
    try{
        const { gpId } = req.query;
        const userId = req.user.id;

        //GroupOrganize 테이블에서 해당 gpId로 검색
        const groupOrganization = await GroupOrganize.findByPk(gpId);

        if (!groupOrganization) {
            return res.status(404).json({ message: '해당 공동구매 글을 찾을 수 없습니다. '});
        }

        //update할 데이터들 받기
        const { name, kakaoadd, peoplenum, deadline_hour, deadline_min, place, content } = req.body;

        //update
        await groupOrganization.update({
            name,
            kakaoadd,
            peoplenum,
            place,
            content,
            deadline_hour,
            deadline_min,
          });

          res.json({ message: '공동구매 정보가 성공적으로 업데이트 되었습니다.'});

    }catch(error) {
        console.log(error);
        next(error);
    }
};

exports.deleteGp = async(req,res,next) => {
    try{
        const { gpId } = req.query;

        //GroupOrganize 테이블에서 해당 gpId로 검색
        const groupOrganization = await GroupOrganize.findByPk(gpId);

        if(!groupOrganization) {
            return res.status(404).json({ message: '해당 공동구매 글을 찾을 수 없습니다.'});
        }

        //GroupTeam 테이블에서 해당 gpId에 author가 1인 user_id 가 존재하는지 확인
        const participantsExists = await GroupTeam.findOne({
            where: { purchase_id: gpId, author: 1 },
        });

        if (participantsExists) {
            return next();
        }

        await GroupTeam.destroy({
            where: { purchase_id: gpId },
        });

        await GroupOrganize.destroy({
            where: { id: gpId },
        });

        return res.json({ message: '공동구매 글이 성공적으로 삭제되었습니다.'});

    }catch(error){
        console.log(error);
        next(error);
    }
};

