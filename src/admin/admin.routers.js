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
	// console.log(req.user);
    let html = pug.renderFile('public/admin/ThemTaiKhoan.pug', {
		user: req.user.result,
		image: req.image,
		role: req.user.role
	});
    res.send(html);
})
.post(isAuthAdmin,adminController.ThemTaiKhoan)

router.route('/ThemLopHoc')
.get(isAuthAdmin, (req, res) => {
    let html = pug.renderFile('public/admin/ThemLopHoc.pug');
    res.send(html);
})
.post(isAuthAdmin,adminController.ThemLopHoc)


router.route('/DanhSachHocSinh')
	.get(isAuthAdmin, adminController.DanhSachHocSinh);

router.route('/DanhSachGiaoVien')
	.get(authMiddleware.isAuthAdmin, adminController.DanhSachGiaoVien);

router.route('/DanhSachBaiDang')
	.get(authMiddleware.isAuthAdmin, adminController.DanhSachBaiDang);

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

router.route('/ThemBaiDang')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemBaiDang.pug', {
			user: req.user.result,
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthAdmin,adminController.ThemBaiDang)

router.route('/XoaBaiDang')
	.post(isAuthAdmin,adminController.XoaBaiDang)

router.post('/ThongTinNguoiDung', isAuthAdmin, adminController.ThongTinNguoiDung);

router.post('/ThayDoiThongTin', isAuthAdmin, adminController.ThayDoiThongTin);

router.get('/Dashboard', isAuthAdmin, (req, res) => {
	let html = pug.renderFile('public/admin/Dashboard.pug', {
		user: req.user.result,
		image: req.image,
		role: req.user.role
	});
	res.send(html);
});

router.route('/DanhSachLopHoc')
	.get(isAuthAdmin, adminController.XemDanhSachLop)
	.post(isAuthAdmin, adminController.XemThongTinLop);

module.exports = router;