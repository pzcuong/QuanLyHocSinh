const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const middleware = require('./auth.middlewares');

router.route('/register', )
    .post(authController.register)
    .get(middleware.isLogined, (req, res) => {
        res.send('dang ky thanh cong');
    });

router.route('/login')
    .post(authController.login)
    .get(middleware.isLogined, (req, res) => {
        res.send('dang nhap thanh cong');
    });

// router.get('/abc', (req,res) => {
//     let html = pug.renderFile('public/auth/changePassword.pug');
//     res.send(html);
// })

// router.get('/abc1', (req,res) => {
//     let html = pug.renderFile('public/changePassword.pug');
//     res.send(html);
// })

router.post('/refresh', authController.refreshToken);

module.exports = router;