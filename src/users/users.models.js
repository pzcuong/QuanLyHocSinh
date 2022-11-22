const sql = require("mssql/msnodesqlv8");
const fs = require('fs');
const stringComparison = require('string-comparison');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 60 } );


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
            let result = await TruyVan("username", `select * from dbo.XacThuc where username = '${username}'`);
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

exports.getUser = getUser;

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