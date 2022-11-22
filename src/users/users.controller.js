const usersModel = require('../users/users.models');
var pug = require('pug');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 60 } );

async function TestSQL(req, res) {
    const MaCH = req.params.MaCH;
    console.log(req.body.SQLQuery)
    if(req.body.SQLQuery) {
        const result = await usersModel.XuLySQL(MaCH, req.body.SQLQuery, req.user.result);
        //console.log(result)
        return res
            .status(result.statusCode)
            .json(result);
    } else {
        return res
            .status(400)
            .json({
                statusCode: 400,
                message: 'Không có dữ liệu',
                alert: 'Không có dữ liệu',
                result: "Vui lòng nhập câu lệnh SQL trước khi gửi yêu cầu"
            });
    }
}

async function LayCauHoi(req, res, next) {
    try {
        const MaCH = req.params.MaCH;
        let result = await usersModel.LayCauHoi(MaCH, req.user.result);
        
        if (result.statusCode == 200) {
            //result.message.NoiDung = html2pug(result.message.NoiDung, { commas: true, fragment: true });
            let html = pug.renderFile('public/user/TestSQL.pug', {
                message: result.message,
                schemas: result.schemas,
                history: result.history,
            });
    
            res.send(html);
        } else {
            let html = pug.renderFile('public/404.pug', { 
                message: result.message,
                redirect: '/user/TestSQL/',
                href: "Đi đến trang câu hỏi"
            });
            res.send(html);
        }
    } catch (error) {
        console.log(error);
        let html = pug.renderFile('public/404.pug', { 
            message: "Lỗi không xác định",
            redirect: '/user/TestSQL/',
            href: "Đi đến trang câu hỏi"
        });
        res.send(html);
    }
}

async function LayDanhSachCauHoi(req, res, next) {
    try {
        let userCH = req.user.result.username + ":DSCH";
        console.log(userCH);
        let value = myCache.get(userCH);
        if(value != undefined) {
            let html = pug.renderFile('public/user/LuyenTap.pug', {
                questionList: value
            });
            return res.send(html);
        } else {
            let result = await usersModel.LayDanhSachCauHoi(req.user.result);
            myCache.set(userCH, result.message[0]);
            let html = pug.renderFile('public/user/LuyenTap.pug', {
                questionList: result.message[0]
            });
            return res.send(html);
        }
    } catch (error) {
        console.log(error);
        let html = pug.renderFile('public/404.pug', {
            message: "Lỗi không xác định",
            redirect: '/user/LuyenTap/',
            href: "Đi đến trang câu hỏi"
        });
        res.send(html);
    }
}

async function LayLichSuTruyVan(req, res, next) {
    // Gợi ý của copilot:
    let result = await usersModel.LayLichSuTruyVan(req.user.result);

    if(result.statusCode == 200) {
        let html = pug.renderFile('public/user/LichSuTruyVan.pug', {
            questionList: result.message
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: '/user/profile/',
            href: "Đi đến trang người dùng"
        });
        res.send(html);
    }
}

async function LayDanhSachBaiTap(req, res, next) {
    try {
        let userCH = req.user.result.username + ":DSBT";
        let value = myCache.get(userCH);
        if(value != undefined) {
            let result = await usersModel.LayDanhSachBaiTap(req.user.result);
            let html = pug.renderFile('public/user/BaiTap.pug', {
                status: value.statusCode,
                questionList: value.message
            });
            return res.send(html);
        } else {
            let result = await usersModel.LayDanhSachBaiTap(req.user.result);
            myCache.set(userCH, result);
            let html = pug.renderFile('public/user/BaiTap.pug', {
                status: result.statusCode,
                questionList: result.message
            });
            res.send(html);
        }
    } catch (error) {
        console.log(error);
        let html = pug.renderFile('public/404.pug', {
            message: "Lỗi không xác định",
            redirect: '/user/BaiTap/',
            href: "Đi đến trang câu hỏi"
        });
        res.send(html);
    }
}

async function LayNoiDungBaiTap(req, res, next) {
    const MaBT = req.params.MaBT;
    const MaCH = req.params.MaCH;
    let result = await usersModel.LayNoiDungBaiTap(MaBT, MaCH, req.user.result);

    if(result.statusCode == 200) {
        let html = pug.renderFile('public/user/NoiDungBaiTap.pug', {
            status: result.statusCode,
            question: result.message,
            schemas: result.schemas,
            history: result.history,
            anotherQuestion: result.anotherQuestion
        });

        res.send(html);
    } else if (result.statusCode == 302) 
        res.redirect(result.url);
    else {
        console.log(result);
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: '/user/profile/',
            href: "Đi đến trang người dùng"
        });
        res.send(html);
    }
}

async function NopBaiTap(req, res, next) {
    const MaBT = req.params.MaBT;
    const MaCH = req.params.MaCH;
    if(req.body.SQLQuery) {
        const result = await usersModel.NopBaiTap(MaBT, MaCH, req.body.SQLQuery, req.user.result);
        //console.log(result)
        return res
            .status(result.statusCode)
            .json(result);
    } else {
        return res
            .status(400)
            .json({
                statusCode: 400,
                message: 'Không có dữ liệu',
                alert: 'Không có dữ liệu',
                result: "Vui lòng nhập câu lệnh SQL trước khi gửi yêu cầu"
            });
    }
}

exports.NopBaiTap = NopBaiTap;
exports.TestSQL = TestSQL;
exports.LayCauHoi = LayCauHoi;
exports.LayDanhSachCauHoi = LayDanhSachCauHoi;
exports.LayLichSuTruyVan = LayLichSuTruyVan;
exports.LayDanhSachBaiTap = LayDanhSachBaiTap;
exports.LayNoiDungBaiTap = LayNoiDungBaiTap;
