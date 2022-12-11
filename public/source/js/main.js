// thu vao thu ra
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".fa-bars");
const wrapper = document.querySelector(".page-wrapper");
console.log(sidebarBtn);

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  wrapper.classList.toggle("margin");
});

// user
function menuhdToggle() {
  console.log("funtion call");
  const toggleMenuhd = document.querySelector(".menu_user_hd");
  toggleMenuhd.classList.toggle("active");
}

// dropdown
var dropdown1 = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown1.length; i++) {
  dropdown1[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}
