const usersModel = require('../users/users.models');
var pug = require('pug');

async function getAllClass(req, res) { 
    let result = await usersModel.getAllClass();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/LopHoc.pug',{
            classlist:  result.result.recordset 
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

exports.getAllClass = getAllClass;