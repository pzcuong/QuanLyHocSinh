const express = require('express');
var pug = require('pug');

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


module.exports = router;

