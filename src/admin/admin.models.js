const sql = require("mssql");
var fs = require('fs');
var json2html = require('json2html');
const { config } = require('dotenv');
require('dotenv').config();

const configUser = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433
}

async function TruyVan(TypeUser, SQLQuery) {
    try {
        if (TypeUser == 'Admin') {
            let pool = await new sql.ConnectionPool(configUser);
            let result = await pool.connect();
            let queryResult = await result.query(SQLQuery);
            await pool.close();
            return {
                statusCode: 200,
                user: 'Admin',
                message: "Thành công",
                result: queryResult
            };
        }
    } catch (err) {
        console.log("Lỗi TruyVan (admin.models)", SQLQuery, err);  
        return {
            statusCode: 500,
            message: 'Lỗi truy vấn SQL!'
        };
    }
}

async function getClass(malop) {
    try {
        if (!malop || malop.indexOf(' ') > -1 || malop.indexOf('@') > -1 || malop.indexOf('.') > -1)
            return ({
                statusCode: 400,
                message: 'Lớp không hợp lệ!',
                alert: 'Lớp không hợp lệ!'
            });
        else {
            let result = await TruyVan("Admin", `select * from LOP where MaLop = '${malop}'`);
            if (result.statusCode == 200 && result.result.recordset.length > 0)
                return ({
                    statusCode: 200,
                    message: 'Thành công',
                    result: result.result.recordset[0]
                });
            else
                return ({
                    statusCode: 404,
                    message: 'Không tìm thấy lớp',
                    alert: 'Không tìm thấy lớp'
                });
        }
    } catch (err) {
        console.log("Lỗi getClass (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}


async function createClass(data) {
    try {

        let SQLQuery = `insert into LOP 
            (MaLop,TenLop, MaHocKy, SiSo, MaKhoiLop) 
            values (N'${data.malop}', N'${data.tenlop}', N'${data.mahocky}', N'${data.siso}', N'${data.makhoilop}')`;
        console.log(SQLQuery);
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.recordsets
            
        })
    }
    catch (err) {
        console.log("Lỗi createClass (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

exports.getClass = getClass;
exports.createClass = createClass;
exports.TruyVan = TruyVan;

async function ThemBaiDang(data) {
    try {
        let SQLQuery = `insert into BaiDang 
        (NoiDung, NgayDang, TieuDe) 
        values (N'${data.NoiDung}', N'${data.NgayDang}', N'${data.TieuDe}')`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.recordsets
        })
    } catch (err) {
        console.log("Lỗi ThemBaiDang (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

exports.ThemBaiDang = ThemBaiDang;