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
    const password = req.body.password;

    if(!req.body.username || !req.body.password) 
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regex.test(password))
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.',
                alert: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.',
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
        const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
        let refreshToken = randToken.generate(24); 

        let role;
        role = "HocSinh";   
        
        const data = {
            username: username,
            HoVaTen: req.body.fullname,
            password: hashPassword,
            refreshToken: refreshToken,
            role: role
        };

        const newUser = await userModel.createUser(data);
        // const accessToken = await authController.createToken(username, refreshToken);

        if(newUser.statusCode === 200 /*&& accessToken.statusCode === 200*/) 
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo tài khoản thành công',
                    username: username,
                    accessToken: accessToken.accessToken,
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


exports.ThemTaiKhoan = ThemTaiKhoan;