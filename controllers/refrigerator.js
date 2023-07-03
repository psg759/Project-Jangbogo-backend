const Sequelize = require('sequelize');
const Refrigerator = require('../models/refrigerator');
const moment = require('moment');
//refrigeList refrigeItem, createItem, updatItem, deleteItem

exports.refrigeList = async(req,res,next) => {
    try {
        const fk_user_id_refrigerator = req.user.id; // 사용자 정보가 없을 경우에 대한 처리
      
        const refrigeRatorList = await Refrigerator.findAll({
            where: {
                fk_user_id_refrigerator: fk_user_id_refrigerator,
                deletedAt: null,
            },
            order: [['id', 'DESC']], // ID를 기준으로 내림차순 정렬
        });

        if(!refrigeRatorList) {
            return res.status(404).json({ message: '해당하는 냉장고 리스트가 존재하지 않습니다.'});
        }

        const formattedList = refrigeRatorList.map((refrigerator) => {
            const { id, PRDLST_NM, CNT, POG_DAYCNT, BSSH_NM, PRDLST_DCNM, BAR_CD, PRDLST_MEMO, createdAt, updatedAt, deletedAt } = refrigerator;
      
            const expirationDate = moment(POG_DAYCNT);
            const today = moment();
            const daysRemaining = expirationDate.diff(today, 'days') + 1;
      
            return {
              id,
              PRDLST_NM,
              CNT,
              POG_DAYCNT,
              BSSH_NM,
              PRDLST_DCNM,
              BAR_CD,
              PRDLST_MEMO,
              createdAt,
              updatedAt,
              deletedAt,
              daysRemaining,
            };
          });
      
          res.status(200).json(formattedList);
      
    } catch (error) {
        next(error);
    }
};

exports.refrigeItem = async(req,res,next) => {
    try{
        const fk_user_id_refrigerator = req.user.id;
        const { refrigeId } = req.query;

        //refrigerator 테이블에서 해당 id와 userId 조회
        const refrigeRatorItem = await Refrigerator.findOne({
            where: {
                id : refrigeId,
                fk_user_id_refrigerator : fk_user_id_refrigerator
            },
        });

        if(!refrigeRatorItem) {
            return res.status(404).json({ message: '해당 냉장고 물품 정보를 찾을 수 없습니다.'});
        }

        res.json(refrigeRatorItem);
    } catch (error) {
        next(error);
    }
};

exports.createItem = async(req,res,next) => {
    try{
        const fk_user_id_refrigerator = req.user.id;
        //제품명, 유통기한, 제조사, 상품유형, 바코드번호, 메모
        const { prdlstName, cnt, pogDayCnt, prdlstDcnm, bsshName, barCd, prdlstMemo} = req.body;

        const newRefrigerator = await Refrigerator.create({
            PRDLST_NM: prdlstName,
            CNT: cnt,
            POG_DAYCNT: pogDayCnt,
            BSSH_NM: bsshName,
            PRDLST_DCNM: prdlstDcnm,
            BAR_CD: barCd,
            PRDLST_MEMO: prdlstMemo,
            fk_user_id_refrigerator: fk_user_id_refrigerator,
        });

        res.json({ message: '나의 냉장고에 제품이 성공적으로 등록되었습니다.'});    
    }catch (error){
        next(error);
    }
};

exports.updateItem = async(req,res,next) => {
    try {

    const { refrigeId } = req.query;
    
    const refrigeRator = await Refrigerator.findByPk(refrigeId);

    if(!refrigeRator) {
        return res.status(404).json({ message: '해당 냉장고 글을 찾을 수 없습니다. '});
    }
    //update할 데이터 받아오기
    const { prdlstName, cnt, pogDayCnt, prdlstDcnm, bsshName, barCd, prdlstMemo} = req.body;
    
    await refrigeRator.update({
        PRDLST_NM: prdlstName,
        CNT: cnt,
        POG_DAYCNT: pogDayCnt,
        BSSH_NM: bsshName,
        PRDLST_DCNM: prdlstDcnm,
        BAR_CD: barCd,
        PRDLST_MEMO: prdlstMemo,
    });
    res.json({ message: '냉장고 정보가 성공적으로 업데이트 되었습니다.'});
    } catch (error) {
        next(error);
    }  
};

exports.deleteItem = async(req,res,next) => {
try{
    const { refrigeId } = req.query;

    const deleteRefrige = await Refrigerator.destroy({
        where: {
            id: refrigeId,
        },
    });
    res.status(200).json({ message: '물품이 성공적으로 삭제되었습니다. '});
} catch (error) {
    next(error);
}
};