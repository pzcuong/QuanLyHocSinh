const express = require('express');
var pug = require('pug');
var path = require("path");
const router = express.Router();

const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const userController = require('./users.controller');

const isAuth = authMiddleware.isAuth;

router.get('/profile', isAuth, async (req, res) => {
	console.log(req.user);
	// let html = pug.renderFile('public/user/profile.pug', {
	// 	user: req.user.result,
	// 	image: req.image,
	// });
	// res.send(html);
    console.log('router profile');
});

router.post('/LuuDiem', async(req, res) => {
	console.log('router LuuDiem');
	console.log(req);
});

router.get('/LuuDiem', async(req, res) => {
	return res.sendFile(path.join(__dirname, '../public/BangDiemMonHoc/index.html'));
})


module.exports = router;

