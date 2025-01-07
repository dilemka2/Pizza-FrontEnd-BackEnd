// buttons
const MenuBTN = document.querySelector('#menu-icon');

// objects
let navbar = document.querySelector('.navbar');

MenuBTN.onclick = () => {
    navbar.classList.toggle('appear');
    loginregisterW.classList.remove('active');
}
