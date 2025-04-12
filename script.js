// Script para el menú hamburguesa
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById('menu-toggle');
    const menuList = document.getElementById('menu-list');
  
    menuToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      if (menuList.style.display === "flex") {
        menuList.style.display = "none";
      } else {
        menuList.style.display = "flex";
        menuList.style.flexDirection = "column";
      }
    });
  });
  