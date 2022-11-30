const sql = require("mssql/msnodesqlv8");
const fs = require('fs');
const stringComparison = require('string-comparison');
const { config } = require('dotenv');

require('dotenv').config();

const configAdmin = {
    user: process.env.admin,
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
            let result = await TruyVan("HocSinh", `select * from HOCSINH where username = '${HoTen}'`);
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
        let SQLQuery = `insert into Admin_Users 
            (username, fullname, rawpassword, password, refreshToken, email, phoneNumber, role) 
            values (N'${data.username}', N'${data.fullname}', N'${data.rawpassword}', N'${data.password}', N'${data.refreshToken}', N'${data.email}', '${data.phoneNumber}', '${data.role}')`;
        
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
    const result = await request.query`update Admin_Users set refreshToken = ${refreshToken} where username = ${username}`;
    await sql.close()
    return result.rowsAffected[0];
}

async function getInfoUser (username) {
    try {
        let userCache = username + ":InfoUser";
        let value = myCache.get(userCache);
        if(value == undefined) {
            if(username == undefined || username.indexOf(' ') > -1 || username.indexOf('@') > -1 || username.indexOf('.') > -1) 
                return ({ 
                    statusCode: 400,
                    message: 'Username không hợp lệ!', 
                    alert: 'Username không hợp lệ!'
                });
            else {
                let SQLQuery = `
                    SELECT .username, fullname, SinhNhat, email, phoneNumber, role
                    FROM Admin_Users FULL JOIN dbo.Admin_ThanhVienNhom ON Admin_ThanhVienNhom.Username = Admin_Users.username
                    WHERE Admin_Users.username = '${username}'
                `;
                let result = await TruyVan("Admin", SQLQuery);
                myCache.set(userCache, result.result.recordset, 1800);
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
        } else {
            console.log("Lấy thông tin user từ cache");
            return ({
                statusCode: 200,
                message: 'Thành công',
                result: value[0],
                table: value
            })
        }
    } catch(err) {
        console.log("Lỗi getInfoUser (users.models)", err);
        GhiLog(`Lỗi getInfoUser - ${err}`);

        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        })
    }
}

async function updatePassword(username, hashPassword) {
    try {
        let SQLQuery = `update XACTHUC set password = N'${hashPassword}' where username = N'${username}'`;
        let result = await TruyVan("Admin", SQLQuery);
        return ({
            statusCode: 200,
            message: 'Thành công',
            alert: 'Thành công',
        });
    } catch(err) {
        console.log("Lỗi updatePassword (users.models)", err);
        GhiLog(`Lỗi updatePassword - ${err}`);

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
        } else {
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
exports.TruyVan = TruyVan;