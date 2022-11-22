var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var pug = require('pug');
var cookieParser = require('cookie-parser');
var compression = require('compression');
const sql = require('mssql/msnodesqlv8');

const authRoute = require('./src/auth/auth.routers');
const userRoute = require('./src/users/users.routers');

require('dotenv').config();
console.log(process.env)
//connect to database

sql.connect(process.env,function(err){
    if(err){
        console.log(err);
    }
    var request = new sql.Request();
    request.query('select* from dbo.XacThuc',function(err,recordSet){
        if(err){
            console.log(err)
        }else{
            console.log(recordSet)
        }
    });
});

var app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use('/public', express.static('./public'));

console.log(process.env.PORT);
var port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    // let html = pug.renderFile('public/Home.pug');
    // res.send(html);
});

app.use('/auth', authRoute);
app.use('/user', userRoute);
