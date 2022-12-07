const express = require('express');
const pug = require('pug');
const router = express.Router();
var path = require("path");
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const isAuth = authMiddleware.isAuth;
const adminController = require('../admin/admin.controller');
 

    router.route('/ThemTaiKhoan' )
    .get(isAuth, (req, res) => {
        let html = pug.renderFile('public/auth/changePassword.pug');
        res.send(html);
    })
    .post(isAuth,adminController.ThemTaiKhoan)

module.exports = router;