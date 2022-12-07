const sql = require("mssql");
const fs = require('fs');
const stringComparison = require('string-comparison');
const { config } = require('dotenv');

require('dotenv').config();

const configAdmin = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433,
    driver: 'msnodesqlv8',
    options:
    {
        trustedConnection:false,
        encrypt: true
    }

}

const configUser = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433,
    driver: 'msnodesqlv8',
    options:
    {
        trustedConnection:false,
        encrypt: true
    }

}

async function getUser (username) {
    try {    
        if(!username || username.indexOf(' ') > -1 || username.indexOf('@') > -1 || username.indexOf('.') > -1) 
            return ({ 
                statusCode: 400,
                message: 'Username không hợp lệ!',
                alert: 'Username không hợp lệ!'
            });
        else {
            let result = await TruyVan("Admin", `select * from XACTHUC where MaND = '${username}'`);
            if(result.statusCode == 200 && result.result.recordset.length > 0) 
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
    } catch(err) {
        console.log("Lỗi getUser (users.models)", err);
        // GhiLog(`Lỗi getUser - ${err}`);

        return ({ 
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống' 
        });
    }
}

async function createUser (data) {
    try {
        let SQLQuery = `insert into XACTHUC 
            (MaND,HashPassword, RefreshToken, Role) 
            values (N'${data.username}', N'${data.password}', N'${data.refreshToken}', N'${data.role}')`;
        
        let result = await TruyVan("Admin", SQLQuery);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.rowsAffected[0]
        })
    }
    catch(err) {
        console.log("Lỗi createUser (users.models)", err);
        // GhiLog(`Lỗi createUser - ${err}`);

        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function updateRefreshToken (username, refreshToken) {
    await sql.connect(configAdmin); 
    const request = await new sql.Request();
    const result = await request.query`update XACTHUC set RefreshToken = ${refreshToken} where MaND = ${username}`;
    await sql.close()
    return result.rowsAffected[0];
}

async function getInfoUser (username) {
    try {
        if(1 == 1) {
            if(username == undefined || username.indexOf(' ') > -1 || username.indexOf('@') > -1 || username.indexOf('.') > -1) 
                return ({ 
                    statusCode: 400,
                    message: 'Username không hợp lệ!', 
                    alert: 'Username không hợp lệ!'
                });
            else {
                let SQLQuery = `
                    SELECT MaND,HashPassword,RefreshToken,Role
                    FROM XACTHUC
                    WHERE  MaND = '${username}'
                `;
                let result = await TruyVan("Admin", SQLQuery);
                console.log(result)

                if(result.statusCode == 200)
                    return { 
                        statusCode: 200,
                        message: 'Thành công',
                        result: result.result.recordset[0],
                        table: result.result.recordset
                    };
                else
                    return ({
                        statusCode: 404,
                        message: 'Không tìm thấy user',
                        alert: 'Không tìm thấy user'
                    })
            }
        
        }
    } catch(err) {
        console.log("Lỗi getInfoUser (users.models)", err);
        // GhiLog(`Lỗi getInfoUser - ${err}`);

        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        })
    }
}

async function updatePassword(username, hashPassword) {
    try {
        let SQLQuery = `update XACTHUC set HashPassword = N'${hashPassword}', where MaND = N'${username}'`;
        let result = await TruyVan("Admin", SQLQuery);
        return ({
            statusCode: 200,
            message: 'Thành công',
            alert: 'Thành công',
        });
    } catch(err) {
        console.log("Lỗi updatePassword (users.models)", err);
        // GhiLog(`Lỗi updatePassword - ${err}`);

        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}
exports.getUser = getUser;
exports.createUser = createUser;
exports.updateRefreshToken = updateRefreshToken;
exports.getInfoUser = getInfoUser;
exports.updatePassword = updatePassword;

async function TruyVan(TypeUser, SQLQuery) {
    try {
        if (TypeUser == 'Admin') {
            let pool = await new sql.ConnectionPool(configAdmin);
            let result = await pool.connect();
            let queryResult = await result.query(SQLQuery);
            await pool.close();
            return {
                statusCode: 200,
                user: 'Admin',
                message: "Thành công",
                result: queryResult
            };
        } else if (TypeUser == 'GiaoVien') {
            let pool = await new sql.ConnectionPool(configAdmin);
            let result = await pool.connect();
            let queryResult = await result.query(SQLQuery);
            await pool.close();
            return {
                statusCode: 200,
                user: 'Admin',
                message: "Thành công",
                result: queryResult
            };
        }else {
            let pool = await new sql.ConnectionPool(configUser);
            let result = await pool.connect();
            let queryResult = await result.query(SQLQuery);
            //console.log("User, QueryResult", queryResult);
            await pool.close();
            return {
                statusCode: 200,
                user: 'User',
                message: "Thành công",
                result: queryResult
            };
        }
    } catch(err) {
        console.log("Lỗi TruyVan (users.models)", SQLQuery, err);
        // GhiLog(`Lỗi truy vấn SQL - ${SQLQuery}\t${err}`);

        return { 
            statusCode: 500,
            message: 'Lỗi truy vấn SQL!'
        };
    }
}

async function DanhSachHocSinh() {
    try {
        let SQLQuery = `SELECT HS.MaHS, HS.HoTen, HS.GioiTinh,HS.NgSinh,L.TenLop
        FROM HOCSINH HS, LOP L, HOCSINH_LOP HS_L
         WHERE HS.MaH = HS_L.MaHS AND HS_L.MaLop = L.MaLop`;

        let result = await TruyVan("Admin", SQLQuery);

        if(result.statusCode == 200 && result.result.recordset.length > 0) { // Có học sinh
            return { 
                statusCode: 200,
                message: result.result.recordsets
            };
        }
        else
            return { 
                statusCode: 404,
                message: 'Không có học sinh nào!'
            };
    } catch(err) {
        console.log("Lỗi DanhSachHocSinh (users.models)", err);
        
        return { 
            statusCode: 500,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Lỗi truy vấn SQL'
        };
    }
}

async function DanhSachLop() {
    try {
        let SQLQuery = `SELECT MaLop,TenLop
        FROM LOP`;
        let result = await TruyVan("Admin",SQLQuery);
        console.log("Danh sách các lớp học", result);
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


exports.TruyVan = TruyVan;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.DanhSachLop = DanhSachLop;