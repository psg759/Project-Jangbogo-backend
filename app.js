const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
//const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');

const app = express();

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

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//app.use('/', pageRouter);   //라우터 연결하는 부분
app.use('/auth', authRouter);


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'productor' ? err : {};
    res.status(err.status || 500);
    //res.render('error');
    //next(err);  //다음 미들웨어로 오류 전달
    res.send(err.message);

});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});


