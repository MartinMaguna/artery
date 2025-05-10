document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menu-toggle');
  const logo = document.querySelector('.logo');
  const body = document.body;

  // Función para detectar mobile
  function isMobile() {
    return window.innerWidth < 768;
  }

  // Crear overlay solo para mobile
  const overlay = document.createElement('div');
  overlay.id = 'menu-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '999',
    textAlign: 'center',
  });

  // Logo centrado arriba
  const logoClone = logo.cloneNode(true);
  Object.assign(logoClone.style, {
    position: 'absolute',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
  });
  logoClone.querySelector('h1').style.color = 'white';
  logoClone.querySelector('h1').style.fontSize = '2rem';

  // Clonar menú (NO mover el original)
  const originalMenu = document.getElementById('menu-list');
  const mobileMenu = originalMenu.cloneNode(true);
  mobileMenu.id = 'menu-list-mobile';
  Object.assign(mobileMenu.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    listStyle: 'none',
    padding: '0',
    marginTop: '4rem',
  });

  // Estilo de enlaces
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    Object.assign(link.style, {
      color: 'white',
      fontSize: '1.5rem',
      textDecoration: 'none',
    });
    link.addEventListener('click', closeOverlay);
  });

  // Cierre al hacer clic fuera del menú
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // Agregar todo al overlay
  overlay.appendChild(logoClone);
  overlay.appendChild(mobileMenu);
  body.appendChild(overlay);

  // Toggle del overlay solo si es mobile
  menuToggle.addEventListener('click', function () {
    if (!isMobile()) return;
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    overlay.style.display = expanded ? 'none' : 'flex';
  });

  // Cierre automático si se agranda la ventana a desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeOverlay();
    }
  });

  function closeOverlay() {
    overlay.style.display = 'none';
    menuToggle.setAttribute('aria-expanded', false);
  }
});
