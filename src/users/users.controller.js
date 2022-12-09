const usersModel = require('../users/users.models');
var pug = require('pug');


async function DanhSachLop(req, res) { 
    let result = await usersModel.DanhSachLop();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/Home.pug');
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function DanhSachHocSinh(req, res) { 
    let result = await usersModel.DanhSachHocSinh();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/Home.pug'); // FE hoc sinh
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'       
        });
        res.send(html);
    }
}


exports.DanhSachHocSinh = DanhSachHocSinh;
exports.DanhSachLop = DanhSachLop;

async function DanhSachBaiDang(req, res) {
    let result = await usersModel.DanhSachBaiDang();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/Home.pug', {
            DanhSachThongBao: result.result.recordsets[0]
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

exports.DanhSachBaiDang = DanhSachBaiDang;

async function DanhSachHocSinhTrongLop(req, res) {
    let DanhSachNamHoc;
    req.MaLop = req.params.MaLop;

    if(!req.body.NamHoc) {
        DanhSachNamHoc = await usersModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'Lấy danh sách năm học thành công',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    let result = await usersModel.DanhSachHocSinhTrongLop(req.MaLop, req.body.HocKy, req.body.NamHoc);
    console.log(result.result.recordsets)
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'Lấy danh sách học sinh trong lớp thành công',
            result: result.result.recordsets[0]
        });
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function NhapDiem(req, res) {
    console.log("Nhap diem")
    // console.log(req.body);
    let MaMH = 'TOAN10'
    let MaLop = req.params.MaLop;

    let result = await usersModel.NhapDiem(
        MaMH, req.body);
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'Nhập điểm thành công',
            
        });
    } else {
        return res.json({
            statusCode: 500,
            message: 'Nhập điểm thất bại',
            result: result.result.recordsets[0]
        });
    }
}

exports.DanhSachHocSinhTrongLop = DanhSachHocSinhTrongLop;
exports.NhapDiem = NhapDiem;

async function DanhSachDiem (req, res) {
    let DanhSachNamHoc;
    req.MaLop = req.params.MaLop;

    if(!req.body.NamHoc) {
        DanhSachNamHoc = await usersModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'Lấy danh sách năm học thành công',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    let MaMH = 'TOAN10'
    let MaLop = req.params.MaLop;
    let result = await usersModel.DanhSachDiem(MaMH, MaLop, req.body.HocKy, req.body.NamHoc);
    console.log(result.result)
    console.log(result.result.length)

    // let data = [{
    //     MaHS: '20521361',
    //     HoTen: 'Đỗ Hữu Khánh Hưng',
    //     MaLHKT: 'DM',
    //     Diem: 10,
    //     MaLop: 'TN101'
    //   },
    //   {
    //     MaHS: '20521361',
    //     HoTen: 'Đỗ Hữu Khánh Hưng',
    //     MaLHKT: 'KT15P',
    //     Diem: 10,
    //     MaLop: 'TN101'
    //   }];

    let kq = [];
    let index = 0;
    for (let i = 0, j = 0; i < result.result.length; i++) {
        console.log(result.result[i].MaHS)
        
        // if( || kq[index].MaHS != result.result[i].MaHS)
        try {
            if(kq[index-1].MaHS != result.result[i].MaHS) 
                kq[index++] = {
                    MaHS: result.result[i].MaHS,
                    HoTen: result.result[i].HoTen,
                    DM: '',
                    KT15P: '',
                    KT1T: '',
                    KTGK: '',
                    KTCK: '',
                }
        } catch (error) {
            kq[index++] = {
                MaHS: result.result[i].MaHS,
                HoTen: result.result[i].HoTen,
                DM: '',
                KT15P: '',
                KT1T: '',
                KTGK: '',
                KTCK: '',
            }
        }
        
        for (j = i; j < result.result.length; j++) {
            if (result.result[i].MaHS === result.result[j].MaHS && result.result[j].MaLHKT != null)
                kq[index - 1][`${result.result[j].MaLHKT}`] = result.result[j].Diem;
            else 
                break;
        }
        // i = j;
    }
    
    // if(result.statusCode === 200) {
    //     return res.json({
    //         statusCode: 200,
    //         message: 'Lấy danh sách học sinh trong lớp và điểm thành công',

    //     });
    // console.log(results)
    return res.json({
        statusCode: 200,
        message: 'Lấy danh sách học sinh trong lớp và điểm thành công',
        result: kq
    });
}

exports.DanhSachDiem = DanhSachDiem;


