const pug = require('pug');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
var randToken = require('rand-token');
const adminModel = require('../admin/admin.models');
const userModel = require('../users/users.models');
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const authMethod = require('../auth/auth.methods');

const SALT_ROUNDS = 10;

async function ThemTaiKhoan(req, res, next) {
    const username = req.body.username;
    const role = req.body.role;

    if(!req.body.username || !req.body.role) 
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const user = await userModel.getUser(username);
    console.log(username);
    if(user.statusCode == 400 || user.statusCode == 500)
        return res
            .status(user.statusCode)
            .send({
                statusCode: user.statusCode,
                message: user.message,
                alert: user.alert
            });

    else if(user.statusCode == 404) {
        const data = {
            username: username,
            role:   role
        };

        const newUser = await userModel.createUser(data);

        if(newUser.statusCode === 200 /*&& accessToken.statusCode === 200*/) 

            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo tài khoản thành công',
                    username: username,
                    redirect: '/admin/ThemTaiKhoan'
                });
        else
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: "Tạo tài khoản không thành công",
                    alert: "Tạo tài khoản không thành công",
                    redirect: '/admin/ThemTaiKhoan'
                });
    }
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: "Username đã tồn tại",
                alert: "Username đã tồn tại",
                redirect: '/admin/ThemTaiKhoan'
            });
}

async function ThemLopHoc(req, res, next) {
    
    const malop = req.body.malop;
    const tenlop = req.body.tenlop;
    const makhoilop = req.body.makhoilop;
    const mahocky = req.body.mahocky;
    const siso = req.body.siso;
    if( !malop || !tenlop || !makhoilop || !mahocky || !siso )   
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const Class = await adminModel.getClass(malop);
    console.log(malop);
    if(Class.statusCode == 400 || Class.statusCode == 500)
        return res
                .status(Class.statusCode)
                .send({
                        statusCode: Class.statusCode,
                        message: Class.message,
                        alert: Class.alert
                });
        
    else if(Class.statusCode == 404) {
    const data = {
                    malop: malop,
                    tenlop: tenlop,
                    makhoilop: makhoilop,
                    mahocky: mahocky,
                    siso: siso
    };
        
    const newClass = await adminModel.createClass(data);
        
        if(newClass.statusCode === 200 ) 
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo lớp thành công',
                    malop: malop,
                    redirect: '/admin/ThemLopHoc'
                });
        else
            return res
                    .status(400)
                    .send({
                            statusCode: 400,
                            message: "Tạo lớp không thành công",
                            alert: "Tạo lớp không thành công",
                            redirect: '/admin/ThemLopHoc'
                    });
                }
    else
        return res
            .status(400)
            .send({
                    statusCode: 400,
                    message: "Lớp học đã tồn tại",
                    alert: "Lớp học đã tồn tại",
                    redirect: '/admin/ThemLopHoc'
            });
}

// async function DanhSachHocSinh(req, res, next) {
    
//     const Class = req.body.Class;
//     if(!req.body.Class) 
//         return res
//             .status(400)
//             .send({
//                 statusCode: 400,
//                 message: 'Vui lòng nhập mã lớp.',
//                 alert: 'Vui lòng nhập mã lớp.',
//             });

//     const Class_data = await adminModel.getClass(Class);
//     console.log(Class_data);
//     if(Class_data.statusCode == 400 || Class_data.statusCode == 500)
//         return res
//             .status(Class.statusCode)
//             .send({
//                 statusCode: Class_data.statusCode,
//                 message: Class_data.message,
//                 alert: Class_data.alert,
                
//             });

//     else if(Class_data.statusCode == 404) {

//         let result = await adminModel.DanhSachHocSinh();
//         console.log(result)
//         if(result.statusCode === 200) {
//             let html = pug.renderFile('public/admin/DanhSachHocSinhtest.pug',{
//                 ClassDataList: result.result.recordset 
//             }); // FE hoc sinh
//             res.send(html);
//         } else {
//             let html = pug.renderFile('public/404.pug', { 
//                 message: result.message,
//                 redirect: 'public/Home.pug'       
//             });
//             res.send(html);
//         }
        
//     }

// }

async function DanhSachHocSinh(req, res) { 
    let result = await adminModel.DanhSachHocSinh();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachHocSinhtest.pug',{
            ClassDataList:  result.result.recordset 
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


async function ThemHocSinhVaoLop(req, res) {
    try {

        const data = req.body;
        console.log("dữ liệu " + data.malop + " " + data.mahs)
        if(!data.malop)
            return res.status(400).send({message: 'Không tìm thấy lớp'});
        const result = await adminModel.ThemHocSinhVaoLop(data.mahs, data.malop);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}


exports.ThemHocSinhVaoLop = ThemHocSinhVaoLop;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.ThemLopHoc = ThemLopHoc;
exports.ThemTaiKhoan = ThemTaiKhoan;