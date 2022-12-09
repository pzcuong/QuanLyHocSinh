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

router.route('/DanhSachHocSinh')
	.get(isAuth, adminController.DanhSachHocSinh);

router.route('/ThemHocSinh')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemHocSinhVaoLop.pug');
    	res.send(html)
	})
	.post(isAuthAdmin, adminController.ThemHocSinhVaoLop);

router.route('/ThemGiaoVien')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemGiaoVienVaoLop.pug');
    	res.send(html)
	})
	.post(isAuthAdmin, adminController.ThemGiaoVienVaoLop);

module.exports = router;