var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var pug = require('pug');
var cookieParser = require('cookie-parser');
var compression = require('compression');
// const sql = require('mssql/msnodesqlv8');

const { config } = require('dotenv');
require('dotenv').config();

const authRoute = require('./src/auth/auth.routers');
const userRoute = require('./src/users/users.routers');
const adminRoute = require('./src/admin/admin.routers');

var app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(cors());

app.use(compression());
app.use('/public', express.static('./public'));

console.log(process.env.PORT);
var port = process.env.PORT || 1433;

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);
 
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.use((req, res, next) => {
    let html = pug.renderFile('public/404.pug', {
        message: 'OOps! Page not found',
        href: 'Quay về trang người dùng',
        redirect: '/auth/login'
    });
	res.send(html);
});

//set public folder as static folder for static files
app.use(express.static('/public'));

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

