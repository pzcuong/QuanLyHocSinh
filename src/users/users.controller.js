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

async function DanhSachBaiDang(req, res) {
    let result = await usersModel.DanhSachBaiDang();

    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/XemThongBao.pug', {
            user: req.user.result,        
			image: req.image,
			role: req.user.role,
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

async function XemNoiDungBaiDang(req, res) {
    let result = await usersModel.NoiDungBaiDang(req.params.MaBaiDang);

    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/NoiDungBaiDang.pug', {
            user: req.user.result,        
			image: req.image,
			role: req.user.role,
            NoiDung: result.result.recordsets[0]
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
    let MaMH = req.body.MaMH;
    let MaLop = req.params.MaLop;

    let result = await usersModel.NhapDiem(MaMH, req.body.Diem);
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

exports.DanhSachBaiDang = DanhSachBaiDang;
exports.getAllClass = getAllClass;
exports.DanhSachHocSinhTrongLop = DanhSachHocSinhTrongLop;
exports.NhapDiem = NhapDiem;

async function DanhSachDiem (req, res) {
    let DanhSachNamHoc;
    console.log(req.body)
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

    if(!req.body.MaMH) {
        console.log(req.user)
        let result = await usersModel.DanhSachMHDoGVDay(req.user.result.MaGV, req.body.HocKy, req.body.NamHoc);
        console.log(result.result)
        return res.json({
            statusCode: 200,
            message: 'Lấy danh sách môn học thành công',
            result: result.result
        });
    }

    let MaMH = req.body.MaMH;
    let MaLop = req.params.MaLop;
    let result = await usersModel.DanhSachDiem(MaMH, MaLop, req.body.HocKy, req.body.NamHoc);
    console.log("Danh sach diem")
    console.log(result.result)
    console.log(result.result.length)

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
exports.XemNoiDungBaiDang = XemNoiDungBaiDang;

async function DanhSachHocSinhTheoMaHS(req, res) {
    console.log(req.user.result)
    let MaHS = req.user.result.MaHS;
    if(!MaHS) 
        MaHS = "20521150"
    
    let result = await usersModel.DanhSachHocSinhTheoMaHS(MaHS);
    console.log("Danh sach hoc sinh theo ma hs")
    console.log(result.result)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/DanhSachHocSinh.pug',{
            ClassDataList:  result.result,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        return res.json({
            statusCode: 500,
            message: 'Lấy danh sách học sinh theo mã học sinh thất bại',
        })
    }
}

exports.DanhSachHocSinhTheoMaHS = DanhSachHocSinhTheoMaHS;
