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
    let html = pug.renderFile('public/admin/ThemTaiKhoan.pug');
    res.send(html);
})
.post(isAuthAdmin,adminController.ThemTaiKhoan)

router.route('/ThemLopHoc' )
.get(isAuthAdmin, (req, res) => {
    let html = pug.renderFile('public/admin/ThemLopHoc.pug');
    res.send(html);
})
.post(isAuthAdmin,adminController.ThemLopHoc)

router.route('/ThemBaiDang')
.get(isAuthAdmin, (req, res) => {
    let html = pug.renderFile('public/admin/ThemBaiDang.pug');
    res.send(html);
})
.post(isAuthAdmin,adminController.ThemBaiDang)

module.exports = router;