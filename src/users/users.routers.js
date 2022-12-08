const express = require('express');
var pug = require('pug');
var path = require("path");
const router = express.Router();
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const userController = require('./users.controller');
const isAuth = authMiddleware.isAuth;

router.post('/LuuDiem', async(req, res) => {
	console.log('router LuuDiem');
	console.log(req);
});

router.get('/LuuDiem', async(req, res) => {
	return res.sendFile(path.join(__dirname, '../public/BangDiemMonHoc/index.html'));
})

router.get('/LuuDiem', async(req, res) => {
	let html = pug.renderFile('public/BangDiemMonHoc/index.pug');
    res.send(html);
})

router.post('/LuuDiem', async(req, res,next) => {
	console.log(req.body)
})

router.route('/DoiMatKhau')
	.get(isAuth, async (req, res) => {
		let html = pug.renderFile('public/auth/changePassword.pug');
		res.send(html);
	})
	.post(isAuth, authController.DoiMatKhau);

router.get('/DanhSachLop', isAuth, async (req, res) => {
	console.log(req.user);
	let html = pug.renderFile('public/Home.pug', {             //FE Lớp
		user: req.user.result,        
		image: req.image,
	});
	res.send(html);
});

router.route('/ThayDoiTT')
	.get(isAuth, async (req, res) => {
		let html = pug.renderFile('public/auth/ThayDoiTT.pug');
		res.send(html);
	})
	.post(isAuth, authController.ThayDoiTT);

router.get('/profile', isAuth, async (req, res) => {
		console.log(req.user);
		let html = pug.renderFile('public/user/profile.pug', {             
			user: req.user.result,        
			image: req.image,
		});
		res.send(html);
	});

router.route('/LopHoc')
	.get(isAuth, userController.getAllClass);

module.exports = router;
