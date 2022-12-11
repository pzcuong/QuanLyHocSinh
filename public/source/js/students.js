const EditBtns = document.querySelectorAll(".js-edit-student");
const modal = document.querySelector(".js-modal");
const modalClose = document.querySelector(".js-modal-close");
const modalContent = document.querySelector(".js-modal-content");

function hideModal() {
  modal.classList.remove("open");
}
function showModal() {
  modal.classList.add("open");
}
for (const EditBtn of EditBtns) {
  EditBtn.addEventListener("click", showModal);
}
modalClose.addEventListener("click", hideModal);
modal.addEventListener("click", hideModal);
modalContent.addEventListener("click", function (event) {
  event.stopPropagation();
});


async function LayThongTin(MaHS) {
  // show modal 
  showModal();
  // blur modal when data is loading
  document.querySelector(".modal.js-modal").classList.add("blur");
  form = document.querySelector("#edit-student-form");

  form.querySelector("input[id=HoTen]").value = "Loading...";
  form.querySelector("input[id=NgSinh]").value = "Loading...";
  form.querySelector("input[id=Email]").value = "Loading...";
  form.querySelector("input[id=DiaChi]").value = "Loading...";


  let response = await fetch('/admin/ThongTinNguoiDung', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: MaHS,
    }),
    json: true
  })

  let text = await response.json();
  console.log(text.data.HoTen)
  //append data to modal content
  NgSinh = text.data.NgSinh.split("T")[0];

  form.querySelector("input[id=HoTen]").value = text.data.HoTen;
  form.querySelector("input[id=NgSinh]").value = NgSinh;
  form.querySelector("input[id=Email]").value = text.data.Email;
  form.querySelector("input[id=DiaChi]").value = text.data.DiaChi;

  // set hidden input
  form.querySelector("input[id=MaHS]").value = MaHS;

  // remove blur background
  document.querySelector(".modal.js-modal").classList.remove("blur");
}

async function CapNhatThongTin() {
  // set block button
  document.getElementById("submit-button").disabled = true;
  document.getElementById("submit-button").innerHTML = "Đang lưu...";
  // blur body background
  document.getElementById("body-wrapper").style.filter = "blur(5px)";

  form = document.querySelector("#edit-student-form");
  data = {
    MaHS: form.querySelector("input[id=MaHS]").value,
    HoTen: form.querySelector("input[id=HoTen]").value,
    NgSinh: form.querySelector("input[id=NgSinh]").value,
    Email: form.querySelector("input[id=Email]").value,
    DiaChi: form.querySelector("input[id=DiaChi]").value,
    Role: "HocSinh"
  }
  console.log(data)
  let response = await fetch('/admin/ThayDoiThongTin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    json: true
  })

  let text = await response.json();
  alert(text.message);

  document.getElementById("submit-button").disabled = false;
  document.getElementById("submit-button").innerHTML = "Xác nhận";
  document.getElementById("body-wrapper").style.filter = "blur(0px)";

}