const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const helmet = require('helmet');
const hpp = require('hpp');

dotenv.config();
const groupRouter = require('./routes/grouppurchase');
const expendRouter = require('./routes/expenditure');
const memoRouter = require('./routes/memo');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
passportConfig();

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express:app,
    watch:true,
});

sequelize.sync({ force : false })
    .then(() => {
        console.log(app.get('port'), '번 포트에서 대기 중');
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });   

//process.env.NODE_ENV는 배포인지 개발 환경인지를 판단할 수 있는 환경변수
if (process.execArgv.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
        }),
    );
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(passport.initialize());

//app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS 설정
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 모든 도메인 허용
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 허용할 HTTP 메서드
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 허용할 헤더
    next();
  });

//라우터 설정
app.use('/grouppurchase', groupRouter);
app.use('/memo', memoRouter);   //라우터 연결하는 부분
app.use('/expenditure', expendRouter);
app.use('/auth', authRouter);
//404에러 핸들링 미들웨어
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info('hello');
    logger.error(error.message);
    next(error);
});

//에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    //res.render('error');
    //next(err);  //다음 미들웨어로 오류 전달
    res.send(err.message);
});

//서버 실행
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});




