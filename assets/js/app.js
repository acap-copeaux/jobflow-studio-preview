const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

function openMenu() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
}

function closeMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

if (menuToggle) menuToggle.addEventListener('click', openMenu);
if (sidebarClose) sidebarClose.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.sidebar-nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

console.log('Jobflow Studio Preview V5 ready.');
