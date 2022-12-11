const sql = require("mssql");
const fs = require('fs');
const stringComparison = require('string-comparison');
const { config } = require('dotenv');

require('dotenv').config();

const configUser = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433,
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: false,
        encrypt: true
    },
    pool: {
        max: 99,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

async function getUser(username) {
    try {
        if (!username || username.indexOf(' ') > -1 || username.indexOf('@') > -1 || username.indexOf('.') > -1)
            return ({
                statusCode: 400,
                message: 'Username không hợp lệ!',
                alert: 'Username không hợp lệ!'
            });
        else {
            let result = await TruyVan("Admin", `select * from XACTHUC where MaND = '${username}'`);
            if (result.statusCode == 200 && result.result.recordset.length > 0)
                return ({
                    statusCode: 200,
                    message: 'Thành công',
                    result: result.result.recordset[0]
                });
            else
                return ({
                    statusCode: 404,
                    message: 'Không tìm thấy user',
                    alert: 'Không tìm thấy user'
                });
        }
    } catch (err) {
        console.log("Lỗi getUser (users.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function getMonHoc(mamh) {
    try {
        if (!mamh || mamh.indexOf(' ') > -1 || mamh.indexOf('@') > -1 || mamh.indexOf('.') > -1)
            return ({
                statusCode: 400,
                message: 'Môn học không hợp lệ!',
                alert: 'Môn học không hợp lệ!'
            });
        else {
            let result = await TruyVan("Admin", `select * from MONHOC where MaMH = '${mamh}'`);
            if (result.statusCode == 200 && result.result.recordset.length > 0)
                return ({
                    statusCode: 200,
                    message: 'Thành công',
                    result: result.result.recordset[0]
                });
            else
                return ({
                    statusCode: 404,
                    message: 'Không tìm thấy môn học',
                    alert: 'Không tìm thấy môn học'
                });
        }
    } catch (err) {
        console.log("Lỗi getMonHoc (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}


async function createUser(data, role) {
    try {
        let SQLQuery = `insert into XACTHUC 
            (MaND,HashPassword, RefreshToken, Role) 
            values (N'${data.MaND}', N'NULL', N'NULL', N'${role}')`;
        
        if (data.GioiTinh == undefined) data.GioiTinh = 'Nam';
        if (data.NgSinh == undefined) data.NgSinh = '01/01/2000';
        if (data.DiaChi == undefined) data.DiaChi = 'NULL';

        if (role == 'HocSinh') {
            SQLQuery_1 = `insert into HOCSINH (MaHS, HoTen, GioiTinh, NgSinh, DiaChi, Email) 
                values (N'${data.MaND}', N'${data.HoTen}', N'${data.GioiTinh}', N'${data.NgSinh}', N'${data.DiaChi}', N'${data.Email}')`;
        };

        if (role == 'GiaoVien' || role == 'Admin') {
            SQLQuery_1 = `insert into GIAOVIEN (MaGV HoTen, GioiTinh, NgSinh, DiaChi, Email) 
                values (N'${data.MaND}', N'${data.HoTen}', N'${data.GioiTinh}', N'${data.NgSinh}', N'${data.DiaChi}', N'${data.Email}')`;
        }

        let result = await TruyVan("Admin", SQLQuery);
        let result_1 = await TruyVan("Admin", SQLQuery_1);
        console.log(result_1);

        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.rowsAffected[0]
        })
    }
    catch (err) {
        console.log("Lỗi createUser (users.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}
async function updateRefreshToken(username, refreshToken) {
    await sql.connect(configUser);
    const request = await new sql.Request();
    const result = await request.query`update XACTHUC set RefreshToken = ${refreshToken} where MaND = ${username}`;
    await sql.close()
    return result.rowsAffected[0];
}

async function getInfoUser(username) {
    try {
        if (username == undefined || username.indexOf(' ') > -1 || username.indexOf('@') > -1 || username.indexOf('.') > -1)
            return ({
                statusCode: 400,
                message: 'Username không hợp lệ!',
                alert: 'Username không hợp lệ!'
            });
        
        else {
            let data = await TruyVan("Admin", `select * from xacthuc where mand = '${username}'`);
            let user_data = data.result.recordset[0];
            try {
                console.log(user_data.Role);
            } catch (error) {
                let result = await TruyVan("Admin", `insert into XACTHUC (MaND, Role) values (N'${username}', N'HocSinh')`);
                user_data = {
                    Role: "HocSinh",
                    MaND: username
                }
            }
            let SQLQuery;
            if (user_data.Role == "HocSinh") {
                SQLQuery = `
                            SELECT MaHS,HoTen, GioiTinh, NgSinh, DiaChi, Email
                            FROM HOCSINH
                            WHERE MaHS = '${username}'`;
            }
            if (user_data.Role == "GiaoVien" || user_data.Role == "Admin") {
                SQLQuery = `
                        SELECT MaGV,HoTen, GioiTinh, NgSinh, DiaChi, Email
                        FROM GIAOVIEN
                        WHERE MaGV = '${username}'`;
            }

            let result = await TruyVan("Admin", SQLQuery);
            console.log(result)
            if (result.statusCode == 200)
                return {
                    statusCode: 200,
                    message: 'Thành công',
                    result: result.result.recordset[0],
                    table: result.result.recordset,
                    role: user_data.Role
                };
            else
                return ({
                    statusCode: 404,
                    message: 'Không tìm thấy user',
                    alert: 'Không tìm thấy user'
                })
        }

    } catch (err) {
        console.log("Lỗi getInfoUser (users.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        })
    }
}

async function updatePassword(username, hashPassword) {
    try {
        let SQLQuery = `update XACTHUC set HashPassword = N'${hashPassword}' where MaND = N'${username}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result)
        if (result.statusCode == 200)
            return ({
                statusCode: 200,
                message: 'Thành công',
                alert: 'Thành công',
            });
    } catch (err) {
        console.log("Lỗi updatePassword (users.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function updateUser(data) {
    try {
        let SQLQuery;
        if (data.role == "GiaoVien") {
            SQLQuery = `update GIAOVIEN set HoTen = N'${data.hoten}',NgSinh = N'${data.ngsinh}',GioiTinh = N'${data.gioitinh}',DiaChi = N'${data.diachi}',Email = N'${data.email}' where MaGV = N'${data.MaND}'`;
        }
        if (data.role == "HocSinh") {
            SQLQuery = `update HOCSINH set HoTen = N'${data.hoten}',NgSinh = N'${data.ngsinh}',GioiTinh = N'${data.gioitinh}',DiaChi = N'${data.diachi}',Email = N'${data.email}' where MaHS = N'${data.MaND}'`;
        }
        console.log(SQLQuery)
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result)
        if (result.statusCode == 200)
            return ({
                statusCode: 200,
                message: 'Thành công',
                alert: 'Thành công',
            });
    } catch (err) {
        console.log("Lỗi updateUser (users.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

let pool, result;

async function ConnectSQL() {
    try {
        pool = new sql.ConnectionPool(configUser);
        result = await pool.connect();
        console.log("Kết nối thành công");
        console.log(result)
    } catch (err) {
        console.log("Lỗi kết nối (users.models)", err);
    }
}

ConnectSQL()

async function TruyVan(TypeUser, SQLQuery) {
    try {
        if (TypeUser == 'Admin') {
            // let pool = await new sql.ConnectionPool(configUser);
            // let result = await pool.connect();
            let queryResult = await result.query(SQLQuery);
            // pool.close();
            return {
                statusCode: 200,
                user: 'Admin',
                message: "Thành công",
                result: queryResult
            };
        }
    } catch (err) {
        console.log("Lỗi TruyVan (users.models)", SQLQuery, err);  
        return {
            statusCode: 500,
            message: 'Lỗi truy vấn SQL!'
        };
    }
}


async function getAllClass() {
    try {
            
            let result = await TruyVan("Admin", `select * from LOP `);
            console.log(result);
            let class_data = result.result.recordset[0];
            console.log(class_data.MaLop)
            return result;
        
    } catch (err) {
        console.log("Lỗi getAllClass (user.models)", err);
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
        console.log("Danh sách các bài đăng", result);
        return result;
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function NoiDungBaiDang(MaBaiDang) {
    try {
        let SQLQuery = `SELECT * FROM BAIDANG WHERE MaBaiDang = N'${MaBaiDang}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Bài đăng", result);
        return result;
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachNamHoc(HocKy) {
    try {
        let SQLQuery = `SELECT * FROM NAMHOC`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Danh sách các năm học", result);
        return result;
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachHocSinhTrongLop(MaLop, HocKy, Nam2) {
    try {
        let SQLQuery = `SELECT * FROM HOCKY
            inner join NAMHOC on HOCKY.MaNam = NAMHOC.MaNamHoc
            inner join LOP on LOP.MaHocKy = HOCKY.MaHocKy
            inner join HOCSINH_LOP on HOCSINH_LOP.MaLop = LOP.MaLop
            inner join HOCSINH on HOCSINH.MaHS = HOCSINH_LOP.MaHS
            where LOP.MaLop = N'${MaLop}' and HocKy = ${HocKy} and Nam2 = ${Nam2}`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log("Danh sách các học sinh trong lớp", result);
        return result;
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function NhapDiem(MaMH, data) {
    try {
        for(let i = 0; i < data.length; i++){
            let CheckHS = `SELECT * FROM KETQUAHOCMON WHERE MaHS = '${data[i].MSHS}'`;
            CheckHS = await TruyVan("Admin", CheckHS);
            // console.log(CheckHS)

            if(CheckHS.statusCode == 200 && CheckHS.result.recordset.length == 0){
                let SQLQuery = `INSERT KETQUAHOCMON(MaMH, MaHS) VaLUES ('${MaMH}','${data[i].MSHS}')`;
                let result = await TruyVan("Admin", SQLQuery);
                // console.log("Danh sách kết quả học môn", result);

                CheckHS = `SELECT * FROM KETQUAHOCMON WHERE MaHS = '${data[i].MSHS}'`;
                CheckHS = await TruyVan("Admin", CheckHS);
            }

            for(let j = 2; j < Object.keys(data[i]).length; j++){
                let MaLHKT = Object.keys(data[i])[j];
                let Diem = Object.values(data[i])[j];

                let CheckDaCoDiem = `SELECT * FROM CT_HOCMON 
                    WHERE MaQTHoc = '${CheckHS.result.recordset[0].MaQTHoc}' AND MaLHKT = '${MaLHKT}'`;

                // console.log(CheckDaCoDiem)
                CheckDaCoDiem = await TruyVan("Admin", CheckDaCoDiem);
                // console.log("CheckDaCoDiem")
                if(CheckDaCoDiem.statusCode == 200 && CheckDaCoDiem.result.recordset.length > 0){
                    // console.log(Object.keys(data[i]).length)

                    // if(Object.keys(data[i]).length == 2) continue;

                    // for(let j = 2; j < Object.keys(data[i]).length; j++){
                        let MaLHKT = Object.keys(data[i])[j];
                        let Diem = Object.values(data[i])[j];

                        let SQLQuery = `UPDATE CT_HOCMON SET
                            Diem = '${Diem}'
                            WHERE MaQTHoc = '${CheckHS.result.recordset[0].MaQTHoc}' AND MaLHKT = '${MaLHKT}'`;
                        let result = await TruyVan("Admin", SQLQuery); 
                        // console.log("Danh sách kết quả học môn", result);
                    // }
                } else {    
                    if(Object.keys(data[i]).length == 2) continue;
    
                    for(let j = 2; j < Object.keys(data[i]).length; j++){
                        let MaLHKT = Object.keys(data[i])[j];
                        let Diem = Object.values(data[i])[j];
    
                        let SQLQuery = `INSERT CT_HOCMON(MaQTHoc, MaLHKT, Diem) VaLUES (
                            '${CheckHS.result.recordset[0].MaQTHoc}',
                            '${MaLHKT}',
                            '${Diem}')`;
                        let result = await TruyVan("Admin", SQLQuery);
                    }
                }

            } 
        }

        // let result = await TruyVan("Admin", SQLQuery);
        // console.log("Danh sách các điểm", result);
        return ({
            statusCode: 200,
            message: 'Nhập điểm thành công!',
        });
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

exports.NhapDiem = NhapDiem;

async function DanhSachDiem(MaMH, MaLop, HocKy, Nam2) {
    try {
        let SQLQuery = `SELECT HS.MaHS, HoTen, MaLHKT, Diem, MaLop FROM HOCSINH HS, 
            (SELECT KQHM.MaHS, MaLHKT, Diem, L.MaLop
            FROM KETQUAHOCMON KQHM LEFT JOIN CT_HOCMON CTHM ON KQHM.MaQTHoc = CTHM.MaQTHoc INNER JOIN HOCSINH_LOP HS_L ON HS_L.MaHS = KQHM.MaHS INNER JOIN LOP L ON L.MaLop = HS_L.MaLop INNER JOIN HOCKY HK ON HK.MaHocKy = L.MaHocKy
            WHERE MaMH = '${MaMH}'AND L.MaLop = N'${MaLop}' AND HK.HocKy = N'${HocKy}' AND HK.MaNam = N'NH${Nam2}'
            GROUP BY KQHM.MaHS, MaLHKT, Diem, L.MaLop) BD
        WHERE HS.MaHS = BD.MaHS`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Danh sách các điểm", result);
        return ({
            statusCode: 200,
            message: 'Lấy danh sách điểm thành công!',
            result: result.result.recordset
        });
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachMHDoGVDay(MaGV, HocKy, Nam2) {
    try {
        let SQLQuery = `select MH.MaMH, TenMH from LOP L 
                inner join HOCKY HK on L.MaHocKy = HK.MaHocKy 
                inner join LOP_MONHOC L_MH ON L.MaLop = L_MH.MaLop
                inner join MONHOC MH ON MH.MaMH = L_MH.MaMH
            where L_MH.MaGV = '${MaGV}' and HocKy = '${HocKy}' and MaNam = 'NH${Nam2}'`;
        
        console.log(SQLQuery)
        let result = await TruyVan("Admin", SQLQuery);
        
        console.log("Danh sách các lớp do GV dạy", result);
        return ({
            statusCode: 200,
            message: 'Lấy danh sách lớp thành công!',
            result: result.result.recordset
        });
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function XemThongTinLop(MaLop) {
    try {
        let SQLQuery = `SELECT * FROM LOP WHERE MaLop = '${MaLop}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Thông tin lớp", result);
        return ({
            statusCode: 200,
            message: 'Lấy thông tin lớp thành công!',
            result: result.result.recordset
        });
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachHocSinhTheoMaHS(MaHS) {
    try {
        let SQLQuery = `select * from hocsinh hs inner join hocsinh_lop hs_l on hs.mahs = hs_l.mahs
            where hs_l.malop in (
                select malop from hocsinh_lop hs_l
                where mahs = '${MaHS}'
            )`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Thông tin học sinh", result);
        return ({
            statusCode: 200,
            message: 'Lấy thông tin học sinh thành công!',
            result: result.result.recordset
        });
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

exports.DanhSachHocSinhTheoMaHS = DanhSachHocSinhTheoMaHS;
exports.DanhSachDiem = DanhSachDiem;
exports.DanhSachMHDoGVDay = DanhSachMHDoGVDay;
exports.getMonHoc = getMonHoc;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.createUser = createUser;
exports.updateRefreshToken = updateRefreshToken;
exports.getInfoUser = getInfoUser;
exports.updatePassword = updatePassword;
exports.getAllClass = getAllClass;
exports.TruyVan = TruyVan;
exports.DanhSachBaiDang = DanhSachBaiDang;
exports.DanhSachHocSinhTrongLop = DanhSachHocSinhTrongLop;
exports.DanhSachNamHoc = DanhSachNamHoc;    
exports.NhapDiem = NhapDiem;
exports.DanhSachBaiDang = DanhSachBaiDang;
exports.NoiDungBaiDang = NoiDungBaiDang;
exports.XemThongTinLop = XemThongTinLop;
