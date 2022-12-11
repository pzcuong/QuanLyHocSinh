const express = require('express');
var pug = require('pug');
var path = require("path");
const router = express.Router();
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const userController = require('./users.controller');
const adminController = require('../admin/admin.controller');
const isAuth = authMiddleware.isAuth;
const isAuthAdmin = authMiddleware.isAuthAdmin;
const isAuthGiaoVien = authMiddleware.isAuthGiaoVien;

router.route('/DoiMatKhau')
	.get(isAuth, async (req, res) => {
		let html = pug.renderFile('public/auth/changePassword.pug');
		res.send(html);
	})
	.post(isAuth, authController.DoiMatKhau);

router.route('/ThayDoiThongTin')
	.get(isAuth, async (req, res) => {
		let html = pug.renderFile('public/user/Profile.pug');
		res.send(html);
	})
	.post(isAuth, authController.ThayDoiTT);

router.get('/profile', isAuth, async (req, res) => {
		console.log(req.user);
		let html = pug.renderFile('public/user/Profile.pug', {             
			user: req.user.result,        
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	});


router.route('/LopHoc')
	.get(isAuth, userController.getAllClass);

	
router.route('/NhapDiem/:MaLop/')
	.get(isAuthGiaoVien, async (req, res) => {
		console.log(req.user);
		req.MaLop = req.params.MaLop;
		let html = pug.renderFile('public/giaovien/NhapDiem.pug', {             
			user: req.user.result,        
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthGiaoVien, userController.DanhSachDiem)
	.put(isAuthGiaoVien, userController.NhapDiem);

router.get('/XemThongBao', isAuth, userController.DanhSachBaiDang);

router.get('/XemThongBao/:MaBaiDang/', isAuth, userController.XemNoiDungBaiDang);

router.route('/DanhSachHocSinh')
	.get(isAuth, userController.DanhSachHocSinhTheoMaHS);

router.route('/DanhSachHocSinh')
	.get(isAuthGiaoVien, adminController.DanhSachHocSinh);

router.route('/DanhSachGiaoVien')
	.get(authMiddleware.isAuthGiaoVien, adminController.DanhSachGiaoVien);

module.exports = router;
