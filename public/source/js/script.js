
async function login() {
  var form = document.querySelector("#formElem");

  data = {
      username: form.querySelector("input[name=username]").value,
      password: form.querySelector("input[name=password]").value                
  }

  let response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  setCookie("x_authorization", text.accessToken);
  console.log(text)
  //alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;
  document.querySelector("#encoded").innerHTML = text.message;
  //window.open(text.captcha_url, "mywindow","menubar=1,resizable=1,width=350,height=250").focus();
};

async function register() {
  var form = document.querySelector("#formElem");

  data = {
      username: form.querySelector("input[name=username]").value,
      password: form.querySelector("input[name=password]").value       
  }

  let response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  setCookie("x_authorization", text.accessToken);
  console.log(text)
  //alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;
  document.querySelector("#encoded").innerHTML = text.message;
  //window.open(text.captcha_url, "mywindow","menubar=1,resizable=1,width=350,height=250").focus();
};


function setCookie(name,value) {
  document.cookie = name + "=" + value + ";; path=/";
}

function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

async function DangXuat() {
  eraseCookie("x_authorization");
  window.location.href = "/";
}

async function checkToken() {
  console.log("Hello");

  let response = await fetch('/user/profile', {
    method: 'GET',
    json: true
  })

  if(response.status != 200) {
    let text = await response.json(); 
    
    if(text.alert)
      alert(text.alert);
    if(text.redirect)
      window.location.href = text.redirect;

    console.log(text);
  }
}

// auto send request to check time of token is valid
setInterval(checkToken, 600000);

async function changePassword() {
  var form = document.querySelector("#formElem");

  data = {
    username: form.querySelector("input[name=username]").value,
    password: form.querySelector("input[name=password]").value,
    newPassword: form.querySelector("input[name=newpassword]").value,
    confirmPassword: form.querySelector("input[name=confirmNewPassword]").value
  }

  let response = await fetch('/user/DoiMatKhau', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;
  //document.querySelector("#encoded").innerHTML = text.message;
  //window.open(text.captcha_url, "mywindow","menubar=1,resizable=1,width=350,height=250").focus();
}


async function ThemTaiKhoanMoi() {
  var form = document.querySelector("#formElem");

  data = {
    username: form.querySelector("input[name=username]").value,
    role: form.querySelector("input[name=role]").value,
 
  }

  let response = await fetch('/admin/ThemTaiKhoan', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;
  //document.querySelector("#encoded").innerHTML = text.message;
  //window.open(text.captcha_url, "mywindow","menubar=1,resizable=1,width=350,height=250").focus();
}

//insert source code js
// Language: javascript
// Path: "https://www.gstatic.com/charts/loader.js"


async function ResetPassword() {
  document.getElementById("btnReset").style.opacity = "0.5";
  document.getElementById("btnReset").value = "Đang xử lý...";

  var form = document.querySelector("#formElem");

  data = {
    username: form.querySelector("input[name=username]").value, 
  }

  let response = await fetch('/auth/forgot-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;

  document.getElementById("btnReset").style.opacity = "1";
  document.getElementById("btnReset").value = "Đặt lại mật khẩu";
}



async function ThayDoiTT() {
  var form = document.querySelector("#formElem");

  data = {
    hoten: form.querySelector("input[name=hoten]").value,
    ngsinh: form.querySelector("input[name=ngsinh]").value,
    gioitinh: form.querySelector("input[name=gioitinh]").value,
    diachi: form.querySelector("input[name=diachi]").value,
    email: form.querySelector("input[name=email]").value
  }

  let response = await fetch('/user/ThayDoiTT', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;
  //document.querySelector("#encoded").innerHTML = text.message;
  //window.open(text.captcha_url, "mywindow","menubar=1,resizable=1,width=350,height=250").focus();
}

async function ThemLopHoc() {
  var form = document.querySelector("#formElem");

  data = {
    malop: form.querySelector("input[name=malop]").value,
    tenlop: form.querySelector("input[name=tenlop]").value,
    mahocky: form.querySelector("input[name=mahocky]").value,
    makhoilop: form.querySelector("input[name=makhoilop]").value,
    siso: form.querySelector("input[name=siso]").value
 
  }

  let response = await fetch('/admin/ThemLopHoc', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;
  //document.querySelector("#encoded").innerHTML = text.message;
  //window.open(text.captcha_url, "mywindow","menubar=1,resizable=1,width=350,height=250").focus();
}

//insert source code js
// Language: javascript
// Path: "https://www.gstatic.com/charts/loader.js"


async function ThemBaiDang() {
  document.getElementById("btn").style.opacity = "0.5";
  document.getElementById("btn").value = "Đang xử lý...";

  var form = document.querySelector("#formElem");

  data = {
    TieuDe: form.querySelector("input[name=TieuDe]").value, 
    NoiDung: form.querySelector("textarea[name=NoiDung]").value,
  }

  let response = await fetch('/admin/ThemBaiDang', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
      window.location.href = text.redirect;

  document.getElementById("btn").style.opacity = "1";
  document.getElementById("btn").value = "ĐĂNG THÔNG BÁO";
}

async function XemThongTinLop(MaLop) {
  var form = document.querySelector("#formElem");
  form.querySelector("input[id=MaLop]").value = "Loading...";
  form.querySelector("input[id=TenLop]").value = "Loading...";

  data = {
    MaLop: MaLop,
  }

  let response = await fetch('/admin/DanhSachLopHoc', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  // alert(text.message);
  if(text.redirect)
    window.location.href = text.redirect;
  
  form.querySelector("input[id=MaLop]").value = text.data[0].MaLop;
  form.querySelector("input[id=TenLop]").value = text.data[0].TenLop;
}