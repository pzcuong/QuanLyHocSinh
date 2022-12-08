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

// async function DanhSachHocSinh(malop) {
//     try {
        
    //     let SQLQuery = `SELECT HS.MaHS, HS.HoTen, HS.GioiTinh,HS.NgSinh,L.TenLop
    //     FROM HOCSINH HS, LOP L, HOCSINH_LOP HS_L
    //     WHERE HS.MaH = HS_L.MaHS AND HS_L.MaLop = L.MaLop AND L.MaLop = '${malop}'`;

    //     let result = await TruyVan("Admin", SQLQuery);
    //     console.log(result);
    //     return result;
    // } catch (err) {
    //     console.log("Lỗi DanhSachHocSinh (users.models)", err);
    //     return {
    //         statusCode: 500,
    //         message: 'Lỗi truy vấn SQL!',
    //         alert: 'Lỗi truy vấn SQL'
    //     };
    // }
// }

async function DanhSachHocSinh() {
    try {
            
            let SQLQuery = `SELECT HS.MaHS, HS.HoTen, HS.GioiTinh,HS.NgSinh,L.TenLop
            FROM HOCSINH HS, LOP L, HOCSINH_LOP HS_L
            WHERE HS.MaHS = HS_L.MaHS AND HS_L.MaLop = L.MaLop `;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachHocSinh (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function ThemHocSinhVaoLop(MaHS, MaLop) {
    try {
        let SQLQuery = `insert into HOCSINH_LOP (MaHS, MaLop) values ('${MaHS}', '${MaLop}')`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Thêm học sinh vào lớp", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

exports.ThemHocSinhVaoLop = ThemHocSinhVaoLop;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.getClass = getClass;
exports.createClass = createClass;
exports.TruyVan = TruyVan;

