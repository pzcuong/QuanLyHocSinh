async function ThemTaiKhoan() {
    // set block button  
    document.getElementById("btnSave").disabled = true;
    document.getElementById("btnSave").innerHTML = "Đang lưu...";
    // blur body background
    document.getElementById("body-wrapper").style.filter = "blur(5px)";

    form = document.querySelector("#form");
    data = {
      MaND: form.querySelector("input[id=MaND]").value,
      HoTen: form.querySelector("input[id=HoTen]").value,
      NgSinh: form.querySelector("input[id=NgSinh]").value,
      Email: form.querySelector("input[id=Email]").value,
      DiaChi: form.querySelector("input[id=DiaChi]").value,
      Role: form.querySelector("select[id=Role]").value,
    }
    console.log(data)
    let response = await fetch('/admin/ThemTaiKhoan', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      json: true
    })
  
    let text = await response.json();
    alert(text.message);

    document.getElementById("btnSave").disabled = false;
    document.getElementById("btnSave").innerHTML = "Xác nhận";
    document.getElementById("body-wrapper").style.filter = "blur(0px)";
    
  }