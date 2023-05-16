// //'express'에서 제공하는 router를 이용해 route 연결
// const express = require('express');
// const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
// const {renderProfile, renderJoin} = require('../controllers/page');      

// const router = express.Router();

// //'router의 use 메소드를 사용해 다음 router에 res를 연결
// router.use((req, res, next) => {
//     res.locals.user = req.user;
//     res.locals.followerCount = 0;
//     res.locals.followingCount = 0;
//     res.locals.followingIdList = [];
//     next();
// });




// router.get('/profile', isLoggedIn, renderProfile);
// router.get('/join', isNotLoggedIn, renderJoin);



// module.exports = router;