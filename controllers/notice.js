const Sequelize = require('sequelize');
const Notice = require('../models/notice');


exports.noticeList = async(req,res,next) => {
    try{
        const userId = req.user.id;

        const noticelist = await Notice.findAll({
            where: {
                user_id: userId,
                
            },
            order: [['id', 'DESC']], // ID를 기준으로 내림차순 정렬
        });

        if(!noticelist) {
            return res.status(404).json({ message: '공지 리스트가 존재하지 않습니다. '});
        }
        res.json(noticelist);
    }catch(error) {
        next(error);
    }
};



