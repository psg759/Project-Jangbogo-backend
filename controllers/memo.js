const Memo = require('../models/memo');
const MemoItem = require('../models/memoitem');

exports.memoList = async(req,res,next) => {
    try {
        const fk_user_id_memo = req.user.id; // 사용자 정보가 없을 경우에 대한 처리
        
        let { date } = req.query;

        // 문자열을 숫자로 변환
        //fk_user_id_memo = parseInt(fk_user_id_memo, 10);

        // 문자열을 Date 객체로 변환
        date = new Date(date);

        //userId와 date을 사용하여 메모 리스트 조회하기
        const memoList = await Memo.findAll({
            where: {
                fk_user_id_memo,
                date,
            },
        });

        if(!memoList) {
            return res.status(404).json({message: 'MemoList를 찾을 수 없습니다.'});
        }

        res.json(memoList);
    } catch (error) {
        next(error);
    }
};

exports.memoItem = async(req,res,next) => {
    try{
        let {fk_memo_id} = req.query;

        fk_memo_id = parseInt(fk_memo_id, 10);
        const memoInfo = await Memo.findOne({
            where: {
                id:fk_memo_id,
            }
        })


        const memoItem = await MemoItem.findAll({
            where: {
                fk_memo_id,
            },
        });

        if(!memoItem) {
            return res.status(404).json({ message: 'Memo를 찾을 수 없습니다.'});
        }

        res.json({memoinform: memoInfo, memoItems: memoItem});
    } catch (error) {
        next(error);
    }
};

exports.createMemo = async(req,res,next) => {
    try{
        const fk_user_id_memo = req.user.id;
        //memoName, memoCnt, memoPrice, memoStatus
        const { memoListName, memoListDate,memoPrice, memos} = req.body;

        const newMemoList = await Memo.create({
            name: memoListName,
            date: memoListDate,
            fk_user_id_memo: fk_user_id_memo,
            total_price: memoPrice,
        });

        const memoListId = newMemoList.id;

        // 메모들을 메모 리스트에 속하도록 생성
        const createdMemos = await Promise.all(
            memos.map(async (memo) => {
            const createdMemo = await MemoItem.create({
            name: memo.name,
            cnt: memo.cnt,
            price: memo.price,
            status: memo.status,
            fk_memo_id: memoListId,
          });
          return createdMemo;
        })
      );
        res.json(200);
    }catch (error){
        next(error);
    }
};

exports.updateMemo = async(req,res,next) => {
    try {
    const fk_user_id_memo = req.user.id;
    const { memoId, memoListName, memoListDate, memoPrice, memos} = req.body;
    
    await Memo.update({
        name: memoListName,
        total_price: memoPrice,
    },
    {
        where: {
            id: memoId,
            date: memoListDate,
            fk_user_id_memo: fk_user_id_memo,
            },
        }
    );
    //해당 메모의 값들을 초기화
    await MemoItem.destroy({
        where: {
          fk_memo_id: memoId,
        },
      });
  
      // Create new memo items for the memo list
    const createdMemos = await Promise.all(
        memos.map(async (memo) => {
          const createdMemo = await MemoItem.create({
            name: memo.name,
            cnt: memo.cnt,
            price: memo.price,
            status: memo.status,
            fk_memo_id: memoId,
          });
          return createdMemo;
        })
      );
      res.json(200);   
    } catch (error) {
        next(error);
    }  
};

exports.deleteMemo = async(req,res,next) => {
try{
    const { memoId } = req.query;

    const deletedMemo = await Memo.destroy({
        where: {
            id: memoId,
        },
    });

    const deleteMemoItems = await MemoItem.destroy({
        where: {
            fk_memo_id : memoId,
        },
    });

    if (deletedMemo === 0) {
        return res.status(404).json({ message: '메모를 찾을 수 없습니다.'});
    }
    res.status(200).json({ message: '메모가 성공적으로 삭제되었습니다. '});
} catch (error) {
    next(error);
}
};