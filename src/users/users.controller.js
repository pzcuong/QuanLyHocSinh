const usersModel = require('../users/users.models');
var pug = require('pug');


async function DanhSachLop(req, res) { 
    let result = await usersModel.DanhSachLop();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/Home.pug');
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function DanhSachHocSinh(req, res) { 
    let result = await usersModel.DanhSachHocSinh();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/Home.pug'); // FE hoc sinh
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'       
        });
        res.send(html);
    }
}


exports.DanhSachHocSinh = DanhSachHocSinh;
exports.DanhSachLop = DanhSachLop;

async function DanhSachBaiDang(req, res) {
    let result = await usersModel.DanhSachBaiDang();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/Home.pug', {
            DanhSachThongBao: result.result.recordsets[0]
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

exports.DanhSachBaiDang = DanhSachBaiDang;