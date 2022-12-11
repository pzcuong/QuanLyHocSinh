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

        let SQLQuery = `
        insert into LOP (MaLop,TenLop, MaHocKy, SiSo, MaKhoiLop) 
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

async function DanhSachHocSinh() {
    try {
            let SQLQuery = `SELECT HS.MaHS, HS.HoTen, HS.GioiTinh,HS.NgSinh,L.TenLop, HS.Email, HS.DiaChi
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

async function DanhSachGiaoVien() {
    try {
            let SQLQuery = `SELECT * FROM GIAOVIEN`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachGiaoVien (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachBaiDang() {
    try {
            let SQLQuery = `SELECT * FROM BAIDANG`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachGiaoVien (admin.models)", err);
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

async function ThemGiaoVienVaoLop(MaGV, MaLop, MaMH) {
    try {
        let SQLQuery = `insert into LOP_MONHOC (MaLop, MaMH, MaGV) values ('${MaLop}', '${MaMH}','${MaGV}' )`;
        let result = await TruyVan("Admin", SQLQuery);
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

async function ThayDoiThongTin(data, table) {
    try {
        let SQLQuery;
        if (table == "HocSinh")
            SQLQuery = `update ${table} set HoTen = N'${data.HoTen}', GioiTinh = N'Nam', NgSinh = N'${data.NgSinh}', Email = N'${data.Email}', DiaChi = N'${data.DiaChi}' where MaHS = N'${data.MaHS}'`;
        else
            SQLQuery = `update ${table} set HoTen = N'${data.HoTen}', GioiTinh = N'Nam', NgSinh = N'${data.NgSinh}', Email = N'${data.Email}', DiaChi = N'${data.DiaChi}' where MaGV = N'${data.MaHS}'`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.recordsets
        })
    } catch (err) {
        console.log("Lỗi ThayDoiThongTin (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachLopHoc() {
    try {
            let SQLQuery = `SELECT * FROM LOP`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachLopHoc (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function XoaBaiDang(MaBD) {
    try {
        let SQLQuery = `delete from BaiDang where MaBaiDang = N'${MaBD}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Xóa bài đăng", result);
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

exports.ThemGiaoVienVaoLop = ThemGiaoVienVaoLop;
exports.ThemHocSinhVaoLop = ThemHocSinhVaoLop;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.getClass = getClass;
exports.createClass = createClass;
exports.TruyVan = TruyVan;
exports.ThemBaiDang = ThemBaiDang;
exports.ThayDoiThongTin = ThayDoiThongTin;
exports.DanhSachLopHoc = DanhSachLopHoc;
exports.DanhSachGiaoVien = DanhSachGiaoVien;
exports.DanhSachBaiDang = DanhSachBaiDang;
exports.XoaBaiDang = XoaBaiDang;