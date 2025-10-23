document.addEventListener("DOMContentLoaded", () => {
  // Detectar si es un dispositivo móvil
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    // 🔹 Ocultar el menú de navegación
    const nav = document.querySelector("nav ul");
    if (nav) nav.style.display = "none";

    // 🔹 Asegurar que el logo se mantenga visible y centrado arriba
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "flex";
      header.style.justifyContent = "center";
      header.style.alignItems = "center";
      header.style.height = "80px";
      header.style.background = "rgba(0, 0, 0, 0.5)";
      header.style.position = "relative";
      header.style.zIndex = "100";
    }

    // 🔹 Mostrar el mensaje sobre la obra generativa
    const display = document.createElement("div");
    display.id = "display-text";
    display.textContent = "Te invitamos a vivir la experiencia desde tu computadora.";

    Object.assign(display.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "white",
      background: "rgba(0, 0, 0, 0.6)",
      padding: "1.5rem 2rem",
      borderRadius: "1rem",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      fontSize: "1.3rem",
      textAlign: "center",
      lineHeight: "1.5",
      textShadow: "0 0 2px rgba(255,255,255,0.9)",
      boxShadow: "0 0 20px rgba(255,255,255,0.05)",
      zIndex: "200",
      width: "80%",
      maxWidth: "400px",
      opacity: "0",
      animation: "fadeIn 2s forwards",
      pointerEvents: "none"
    });

    document.body.appendChild(display);

    // 🔹 Añadir animación CSS desde JS
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; filter: blur(5px); }
        to { opacity: 1; filter: blur(0); }
      }

      /* Ocultar el botón hamburguesa */
      #menu-toggle {
        display: none !important;
      }

      /* Asegurar que el main ocupe toda la pantalla */
      #main-inicio {
        height: 100vh;
        overflow: hidden;
      }

      /* Evitar que el canvas quede tapado */
      canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }
});
