// buttons
const MenuBTN = document.querySelector('#menu-icon');
const getTopBTN = document.getElementById('getTopBTN');

// objects
let navbar = document.querySelector('.navbar');

MenuBTN.onclick = () => {
    navbar.classList.toggle('appear');
    loginregisterW.classList.remove('active');
}

window.onscroll = () => {
    getTopBTN.classList.toggle('active', window.scrollY > 300);
}
