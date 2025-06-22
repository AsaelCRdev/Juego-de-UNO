const menuToggle = document.getElementById('menuToggle');
const asideMenu = document.querySelector('.asideMenu');
menuToggle.addEventListener('click', () => {
    asideMenu.classList.toggle('open');
});