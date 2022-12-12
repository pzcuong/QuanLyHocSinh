# IE104.N13.CNCL - Nhóm 01
#### [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#ph%E1%BA%A7n-m%E1%BB%81m-qu%E1%BA%A3n-l%C3%BD-h%E1%BB%8Dc-sinh)*Phần mềm: Quản lý học sinh
[![Build Status](https://camo.githubusercontent.com/c29bc856325cd819f5a3bb6536b7982f04a161e656de066c4c970e0079c14ff5/68747470733a2f2f7472617669732d63692e6f72672f6a6f656d6363616e6e2f64696c6c696e6765722e7376673f6272616e63683d6d6173746572)](https://travis-ci.org/joemccann/dillinger)

## [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#gi%E1%BB%9Bi-thi%E1%BB%87u)Giới thiệu

Việc quản lý học sinh trên sổ sách cũng tốn rất nhiều công sức cho nhân viên nhà trường. Đối với các trường có số lượng học sinh ít, không đủ điều kiện về kinh tế thì có thể quản lý trên sổ sách, còn đối với các trường ở thành phố, có đủ điều kiện kinh tế và có số lượng học sinh lớn thì việc quản lý cổ điển như vậy sẽ tốn rất nhiều thời gian, công sức. Một học sinh thì có rất nhiều thông tin cá nhân, các cột điểm của các môn học khác nhau, các vấn đề phát sinh liên quan… Các thông tin này rất phức tạp, cùng với số lượng lớn thông tin thì việc quản lý này trở nên bất khả thi. Ngoài ra, việc quản lý học sinh cũng trở nên phức tạp hơn, không chỉ quản lý từng học sinh mà còn đòi hỏi kiểm kê số liệu, thống kê điểm số của từng học sinh, từng môn, từng lớp.  
Vì thế việc thay đổi giữa quản lý trực tiếp và quản lý trực tuyến là hoàn toàn cần thiết.

## [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#t%C3%ADnh-n%C4%83ng)Tính năng

-   Tiếp nhận học sinh (Admin)
-   Tiếp nhận giáo viên (Admin)
-   Xếp lớp (Admin)
-   Tra cứu thông tin học sinh (Giáo viên, Admin)
-   Tra cứu lớp học (Giáo viên, Admin)
-   Thay đổi thông tin cá nhân (Giáo viên, Admin, Học sinh)
-   Thêm bảng điểm môn học (Giáo viên, Học sinh)
-   Xem bảng điểm môn học (Giáo viên, Admin, Học sinh)
-   Đăng bài đăng thông báo quan trọng (Giáo viên, Admin)
-   Xem thông báo, tin tức quan trọng (Giáo viên, Admin, Học sinh)

## [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#c%C3%B4ng-ngh%E1%BB%87-s%E1%BB%AD-d%E1%BB%A5ng)Công nghệ sử dụng

-   [Node.js] - Xử lý API, Back-end
-   [Express] - Framework nằm trên chức năng máy chủ web của NodeJS
-   [Pug] - Template Preprocessor là một cú pháp để viết html
-   [Azure] - MS SQL Server

## [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#c%C3%A0i-%C4%91%E1%BA%B7t)Cài đặt

Yêu cầu:  [Node.js](https://nodejs.org/)  v19+ để có thể chạy chương trình.  
Cài đặt các thư viện cần thiết

```
npm install
npm start
```

## [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#docker)Docker

Phần mềm quản lý học sinh đã được triển khai dưới dạng container lưu trữ trên Docker.

Mặc định, Docker sẽ thực thi trên port 8080, và lưu ý đừng thay đổi nó nhé!

```
docker build -t quanly-hocsinh:<tag name> .
```

Nhóm cũng đã thực hiện việc lưu trữ trên DockerHub, do đó, chỉ cần chạy lệnh run cũng có thể thực hiện được

```
docker run --name <name> -d -p 8080:8080 pzcuong/quanlyhocsinh:quanly-hocsinh
```

Kiểm tra lại tình trạng máy chủ:

```
localhost:8000
```

## [](https://github.com/pzcuong/QuanLyHocSinh/tree/master#license)License

MIT
