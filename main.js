let dropdown = document.querySelectorAll(".dropdown");
console.log(dropdown);

for (var i = 0; i < dropdown.length; i++)
{
    dropdown[i].addEventListener("click", (e)=>{
        let dropdownParent = e.target.parentElement.parentElement;
        console.log(dropdownParent);
        dropdownParent.classList.toggle("ShowMenu");
    });

}

let dropdown1 = document.querySelectorAll(".link_name");
console.log(dropdown1);

for (var i = 0; i < dropdown1.length; i++)
{
    dropdown1[i].addEventListener("click", (e)=>{
        let dropdown1Parent = e.target.parentElement.parentElement;
        console.log(dropdown1Parent);
        dropdown1Parent.classList.toggle("ShowMenu");
    });

}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".fa-bars");
console.log(sidebarBtn);

sidebarBtn.addEventListener("click" , ()=>{
    sidebar.classList.toggle("close");
});

// document.getElementById("profile").onclick = function() {menuhdToggle()};

function menuhdToggle(){
    console.log("funtion call")
    const toggleMenuhd = document.querySelector('.menu_user_hd');
    toggleMenuhd.classList.toggle('active');
}