const express = require('express');
var pug = require('pug');
const router = express.Router();
const authController = require('./auth.controller');
const middleware = require('./auth.middlewares');
var path = require("path");

// router.route('/register', )
//     .post(authController.register)
//     .get(middleware.isAuthAdmin, (req, res) => {
//         let html = pug.renderFile('public/auth/Register.pug');
//         res.send(html);
//     });

router.route('/login')
    .post(authController.login)
    .get(middleware.isLogined, (req, res) => {
        let html = pug.renderFile('public/auth/Login.pug');
        res.send(html);
    });


router.route('/forgot-password')
    .get((req,res) => {
        let html = pug.renderFile('public/auth/forgotPassword.pug');
        res.send(html);
    })
    .post(authController.QuenMatKhau);

router.post('/refresh', authController.refreshToken);

module.exports = router;