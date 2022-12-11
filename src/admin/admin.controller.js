const pug = require('pug');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
var randToken = require('rand-token');
const adminModel = require('../admin/admin.models');
const userModel = require('../users/users.models');
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const authMethod = require('../auth/auth.methods');

const SALT_ROUNDS = 10;

async function ThemTaiKhoan(req, res, next) {
    const username = req.body.MaND;
    const role = req.body.Role;

    if(!username || !role || !req.body.HoTen || !req.body.Email) 
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const user = await userModel.getUser(username);
    console.log(username);
    if(user.statusCode == 400 || user.statusCode == 500)
        return res
            .status(user.statusCode)
            .send({
                statusCode: 500,
                message: "lỗi truy vấn SQL",
                alert: "Tài khoản đã tồn tại"
            });

    else if(user.statusCode == 404) {
        const newUser = await userModel.createUser(req.body, req.body.Role);

        if(newUser.statusCode === 200 ) 
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo tài khoản thành công',
                    username: username,
                    redirect: '/admin/ThemTaiKhoan'
                });
        else
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: "Tạo tài khoản không thành công",
                    alert: "Tạo tài khoản không thành công",
                    redirect: '/admin/ThemTaiKhoan'
                });
    }
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: "Username đã tồn tại",
                alert: "Username đã tồn tại",
                redirect: '/admin/ThemTaiKhoan'
            });
}

async function ThemLopHoc(req, res, next) {
    
    const malop = req.body.malop;
    const tenlop = req.body.tenlop;
    const makhoilop = req.body.makhoilop;
    const mahocky = req.body.mahocky;
    const siso = req.body.siso;
    if( !malop || !tenlop || !makhoilop || !mahocky || !siso )   
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const Class = await adminModel.getClass(malop);
    console.log(malop);
    if(Class.statusCode == 400 || Class.statusCode == 500)
        return res
                .status(Class.statusCode)
                .send({
                        statusCode: Class.statusCode,
                        message: Class.message,
                        alert: Class.alert
                });
        
    else if(Class.statusCode == 404) {
    const data = {
                    malop: malop,
                    tenlop: tenlop,
                    makhoilop: makhoilop,
                    mahocky: mahocky,
                    siso: siso
    };
        
    const newClass = await adminModel.createClass(data);
        
        if(newClass.statusCode === 200 ) 
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo lớp thành công',
                    malop: malop,
                    redirect: '/admin/ThemLopHoc'
                });
        else
            return res
                    .status(400)
                    .send({
                            statusCode: 400,
                            message: "Tạo lớp không thành công",
                            alert: "Tạo lớp không thành công",
                            redirect: '/admin/ThemLopHoc'
                    });
                }
    else
        return res
            .status(400)
            .send({
                    statusCode: 400,
                    message: "Lớp học đã tồn tại",
                    alert: "Lớp học đã tồn tại",
                    redirect: '/admin/ThemLopHoc'
            });
}


async function DanhSachHocSinh(req, res) { 
    let result = await adminModel.DanhSachHocSinh();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachHocSinh.pug',{
            ClassDataList:  result.result.recordsets[0],
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
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

async function DanhSachGiaoVien(req, res) { 
    let result = await adminModel.DanhSachGiaoVien();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachGiaoVien.pug',{
            ClassDataList:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
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
    let result = await adminModel.DanhSachBaiDang();
    console.log(result.result.recordset)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachBaiDang.pug',{
            ThongTin:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
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

async function ThemHocSinhVaoLop(req, res) {
    try {

        const data = req.body;
        if(!data.malop || !data.mahs)
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Vui lòng nhập đầy đủ thông tin',
                    alert: "Vui lòng nhập đầy đủ thông tin",
                    redirect: '/admin/ThemHocSinh'
                });
        let result_user = await  userModel.getUser(data.mahs);
        if (result_user.statusCode == 200 ){
            let result_class = await adminModel.getClass(data.malop)
            if (result_class.statusCode == 200 ){
                const result = await adminModel.ThemHocSinhVaoLop(data.mahs, data.malop);
                console.log(result);
                return res
                    .status(200)
                    .send({
                        statusCode: 200,
                        message: 'Thêm học sinh vào lớp thành công',
                        alert: "Thêm học sinh vào lớp thành công",
                        redirect: '/admin/ThemHocSinh'
                    });
            }else {
                return res
                        .status(400)
                        .send({
                            statusCode: 400,
                            message: 'Không tìm thấy lớp',
                            alert: "Không tìm thấy lớp",
                            redirect: '/admin/ThemHocSinh'
                    });
            }

        }else{
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Không tìm thấy học sinh',
                    alert: "Không tìm thấy học sinh",
                    redirect: '/admin/ThemHocSinh'
            });
        }
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .send({
            statusCode: 400,
            message: 'Thêm học sinh vào lớp không thành công',
            alert: "Thêm học sinh vào lớp không thành công thành công",
            redirect: '/admin/ThemHocSinh'
        });
    }
}

async function ThemGiaoVienVaoLop(req, res) {
    try {

        const data = req.body;
        console.log(data.magv)
        if(!data.malop || !data.mamh || data.magv)
            return res
                    .status(400)
                    .send({
                        statusCode: 400,
                        message: 'Vui lòng nhập đầy đủ thông tin!',
                        alert: "Vui lòng nhập đầy đủ thông tin!",
                        redirect: '/admin/ThemGiaoVien'
                    });
        let result_class = await adminModel.getClass(data.malop);
        if (result_class.statusCode == 200 ){
            let result_monhoc = await userModel.getMonHoc(data.mamh);
            if (result_monhoc.statusCode == 200){
                let result_giaovien = await userModel.getUser(data.magv);
                if(result_giaovien.statusCode == 200){
                    const result = await adminModel.ThemGiaoVienVaoLop(data.malop, data.mamh, data.magv);
                    console.log(result);
                    return res
                        .status(200)
                        .send({
                            statusCode: 200,
                            message: 'Thêm giáo viên vào lớp thành công',
                            alert: "Thêm giáo viên vào lớp thành công",
                            redirect: '/admin/ThemGiaoVien'
                        });
                }else{
                        return res
                            .status(400)
                            .send({
                                statusCode: 400,
                                message: 'Không tìm thấy giáo viên',
                                alert: "Không tìm thấy giáo viên",
                                redirect: '/admin/ThemGiaoVien'
                        });
                }
            }else{
                    return res
                    .status(400)
                    .send({
                        statusCode: 400,
                        message: 'Không tìm thấy môn học',
                        alert: "Không tìm thấy môn học",
                        redirect: '/admin/ThemGiaoVien'
                });
            }
        }else{
                return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Không tìm thấy lớp',
                    alert: "Không tìm thấy lớp",
                    redirect: '/admin/ThemGiaoVien'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400)
                .send({
                    statusCode: 400,
                    message: 'Thêm giáo viên vào lớp không thành công',
                    alert: "Thêm giáo viên vào lớp không thành công thành công",
                    redirect: '/admin/ThemGiaoVien'
                });
    }
}

async function ThemBaiDang(req, res) {
    // Get day, month, year from date
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const NgayDang = day + '/' + month + '/' + year;

    const TieuDe = req.body.TieuDe;
    const NoiDung = req.body.NoiDung;

    if(!TieuDe || !NoiDung)
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const BaiDang = await adminModel.ThemBaiDang({
        TieuDe: TieuDe,
        NoiDung: NoiDung,
        NgayDang: NgayDang
    })

    if(BaiDang.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Thêm bài đăng thành công',
                redirect: '/admin/ThemBaiDang'
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Thêm bài đăng không thành công',
                alert: 'Thêm bài đăng không thành công',
                redirect: '/admin/ThemBaiDang'
            });
}

async function ThongTinNguoiDung(req, res) {
    try {
        const data = req.body;
        //convert to string
        let username = data.username.toString();
        
        const result = await userModel.getInfoUser(username);
        if(result.statusCode === 200)
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Lấy thông tin người dùng thành công',
                    data: result.result
                });
        else
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Lấy thông tin người dùng không thành công',
                });
    } catch (error) {
        console.log(error);
        return res.status(500)
                .send({
                    statusCode: 500,
                    message: 'Lấy thông tin người dùng không thành công',
                });
    }

}

async function ThayDoiThongTin(req, res) {
    const data = req.body;
    console.log("data")
    console.log(data)
    //convert to string
    if(!data.MaHS || !data.HoTen || !data.DiaChi || !data.Email || !data.NgSinh)
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });
    
    let Role = await userModel.getUser(data.MaHS);
    Role = Role.result.Role;
    const result = await adminModel.ThayDoiThongTin(
        data,
        Role
    )
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Thay đổi thông tin thành công',
                redirect: '/admin/ThongTinNguoiDung'
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Thay đổi thông tin không thành công',
                alert: 'Thay đổi thông tin không thành công',
                redirect: '/admin/ThongTinNguoiDung'
            });
}

async function DanhSachLopHoc(req, res) {
    const result = await adminModel.DanhSachLopHoc();
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Lấy danh sách lớp học thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Lấy danh sách lớp học không thành công',
            });
}

async function XemDanhSachLop(req, res) { 
    let result = await adminModel.DanhSachLopHoc();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachLopHoc.pug',{
            ClassDataList:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
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

async function XemThongTinLop(req, res) {
    let result = await userModel.XemThongTinLop(req.body.MaLop);
    if(result.statusCode === 200) {
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Lấy thông tin lớp học thành công',
                data: result.result
            });
    } else {
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Lấy thông tin lớp học không thành công',
            });
    }       
}

async function XoaBaiDang(req, res) {
    const result = await adminModel.XoaBaiDang(req.body.MaBaiDang);
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Xóa bài đăng thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Xóa bài đăng không thành công',
            });
}

exports.XemThongTinLop = XemThongTinLop;
exports.ThemGiaoVienVaoLop = ThemGiaoVienVaoLop;
exports.ThemHocSinhVaoLop = ThemHocSinhVaoLop;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.ThemLopHoc = ThemLopHoc;
exports.ThemTaiKhoan = ThemTaiKhoan;
exports.ThemBaiDang = ThemBaiDang;
exports.ThongTinNguoiDung = ThongTinNguoiDung;
exports.ThayDoiThongTin = ThayDoiThongTin;
exports.DanhSachLopHoc = DanhSachLopHoc;
exports.DanhSachGiaoVien = DanhSachGiaoVien;
exports.DanhSachBaiDang = DanhSachBaiDang;
exports.XemDanhSachLop = XemDanhSachLop;
exports.XoaBaiDang = XoaBaiDang;