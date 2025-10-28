document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector("#visualizacion");
  const btnLinea = document.querySelector("#btn-timeline");
  const btnCategorias = document.querySelector("#btn-categorias");
  let datos = null;

  // Cargar JSON
  fetch("/ensayos/ensayo_arte_electronico.json")
    .then((res) => res.json())
    .then((json) => {
      datos = json.arte_digital;
      mostrarLineaTiempo(); // mostrar por defecto
    })
    .catch((err) => console.error("Error al cargar JSON:", err));

  // Función para mostrar la línea de tiempo
  function mostrarLineaTiempo() {
    contenedor.innerHTML = "<h2>Línea de tiempo</h2>";
    datos.linea_tiempo.forEach((evento) => {
      const div = document.createElement("div");
      div.classList.add("evento");
      div.innerHTML = `
        <h3>${evento.anio}</h3>
        <h4>${evento.titulo}</h4>
        <p>${evento.descripcion}</p>
      `;
      contenedor.appendChild(div);
    });
  }

  // Función para mostrar las categorías
  function mostrarCategorias() {
    contenedor.innerHTML = "<h2>Categorías</h2>";
    datos.categorias.forEach((cat) => {
      const div = document.createElement("div");
      div.classList.add("evento");
      div.innerHTML = `
        <h3>${cat.nombre}</h3>
        <p>${cat.descripcion}</p>
      `;
      contenedor.appendChild(div);
    });
  }

  // Listeners: los botones controlan qué se ve
  btnLinea.addEventListener("click", mostrarLineaTiempo);
  btnCategorias.addEventListener("click", mostrarCategorias);
});
