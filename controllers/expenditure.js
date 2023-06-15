const Memo = require('../models/memo');
const MemoItem = require('../models/memoitem');
const { Op } = require('sequelize');

exports.expendYear = async(req,res,next) => {
    try {
        const fk_user_id_memo = req.user.id; // 사용자 정보가 없을 경우에 대한 처리
        
        let { year } = req.query;

        //userId와 year을 사용하여 expenditure-year 리스트 조회하기
        const expendYList = await Memo.findAll({
            where: {
                fk_user_id_memo,
                date: {
                    [Op.startsWith]: `${year}-`,
                },
            },
        });

        if(!expendYList) {
            return res.status(404).json({message: 'Expenditure를 찾을 수 없습니다.'});
        }

        //월별 소비 초기화
        const monthlyExpenses = Array(12).fill(0);  

        expendYList.forEach((memo) => {
            const month = new Date(memo.date).getMonth();
            monthlyExpenses[month] += memo.total_price;
        });

        res.json(monthlyExpenses);
    } catch (error) {
        next(error);
    }
};

exports.expendMonth = async(req,res,next) => {
    try {
        const fk_user_id_memo = req.user.id; // 사용자 정보가 없을 경우에 대한 처리
        
        let { year, month } = req.query;

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
        const daysInMonth = endDate.getDate();
        const dailyExpenses = Array(daysInMonth).fill(0);

        //userId와 year을 사용하여 expenditure-year 리스트 조회하기
        const expendMList = await Memo.findAll({
            where: {
                fk_user_id_memo,
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        if(!expendMList) {
            return res.status(404).json({message: 'Expenditure를 찾을 수 없습니다.'});
        }

        expendMList.forEach((memo) => {
            const date = new Date(memo.date);
            const day = date.getDate();
            const price = memo.total_price || 0;
            dailyExpenses[day - 1] += price;
        });

        res.json(dailyExpenses);
    } catch (error) {
        next(error);
    }
};

