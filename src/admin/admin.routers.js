const express = require('express');
const pug = require('pug');
const router = express.Router();
var path = require("path");
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const isAuth = authMiddleware.isAuth;
const isAuthAdmin = authMiddleware.isAuthAdmin;
const adminController = require('../admin/admin.controller');
 

router.route('/ThemTaiKhoan' )
.get(isAuthAdmin, (req, res) => {
    let html = pug.renderFile('public/auth/changePassword.pug');
    res.send(html);
})
.post(isAuthAdmin,adminController.ThemTaiKhoan)

module.exports = router;