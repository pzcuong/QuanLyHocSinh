const sql = require("mssql");
var fs = require('fs');
var json2html = require('json2html');
const { config } = require('dotenv');
require('dotenv').config();

const configAdmin = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433
}

async function TruyVan(SQLQuery) {
    try {
        let pool = await new sql.ConnectionPool(configAdmin);
        let result = await pool.connect();
        let queryResult = await result.query(SQLQuery);
        //console.log("Admin, QueryResult", queryResult);
        await pool.close();
        return {
            statusCode: 200,
            user: 'Admin',
            message: "Thành công",
            result: queryResult
        };
    } catch(err) {
        console.log("Lỗi TruyVan (admin.models)", SQLQuery, err);
        // GhiLog(`Lỗi truy vấn SQL - ${SQLQuery}\t${err}`);

        return { 
            statusCode: 500,
            message: 'Lỗi truy vấn SQL!'
        };
    }
}


// async function ThemCauHoi(data) {
//     try {
//         let SQLQuery = `insert into Admin_CauHoi (MucDo, TieuDe, NoiDung, LuocDo, TinhTrang) 
//             values (N'${data.MucDo}', N'${data.TieuDe}', N'${data.NoiDung}', N'${data.LuocDo}', '${data.TinhTrang}')`;
//         let result = await TruyVan(SQLQuery);
//         console.log("Thêm Câu Hỏi ", result);
//         if(result.statusCode != 200) 
//             return ({
//                 statusCode: 400,
//                 message: 'Thêm Câu Hỏi Thất Bại'
//             })
//         else {
//             SQLQuery = `select MaCH from Admin_CauHoi where TieuDe = N'${data.TieuDe}' and NoiDung = N'${data.NoiDung}' and LuocDo = N'${data.LuocDo}'`;
//             result = await TruyVan(SQLQuery);
//             let MaCH = result.result.recordset[0].MaCH;
//             console.log("Thêm Câu Hỏi ", MaCH);
//             result = await ThemTestCase(MaCH, data.SQLQuery);
//             if(result.statusCode != 200)
//                 return ({
//                     statusCode: 400,
//                     message: 'Thêm Test case Thất Bại'
//                 })
//             return ({
//                 statusCode: 200,
//                 message: `Thêm Câu Hỏi Thành Công - Mã số câu hỏi: ${MaCH}`,
//                 MaCH: MaCH
//             })
//         }
//     } catch(err) {  
//         console.log(err);
//         return ({
//             statusCode: 400,
//             message: 'Thêm Câu Hỏi Thất Bại'
//         })
//     }
// }


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


exports.createUser = createUser;
exports.TruyVan = TruyVan;
