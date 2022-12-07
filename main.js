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



let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".fa-bars");
console.log(sidebarBtn);

sidebarBtn.addEventListener("click" , ()=>{
    sidebar.classList.toggle("close");
});



function menuhdToggle(){
    console.log("funtion call")
    const toggleMenuhd = document.querySelector('.menu_user_hd');
    toggleMenuhd.classList.toggle('active');
} 

var header = $('.header');
