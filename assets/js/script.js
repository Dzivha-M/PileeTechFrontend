const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuBtn.onclick = function() {
    nav.classList.toggle('open');
};