// Configuración de la proyección y el tamaño del mapa
const width = 800;
const height = 600;
const projection = d3.geoOrthographic()
    .scale(250)
    .translate([width / 2, height / 2])
    .rotate([0, 0]);

const path = d3.geoPath().projection(projection);

// Crear el contenedor del mapa
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Cargar y dibujar el mapa base (Mundi)
d3.json("https://d3js.org/world-110m.v1.json").then(function(world) {
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "country");

    // Cargar los datos de los migrantes
    d3.json("posdata/posdata-migrante.json").then(function(data) {
        console.log(data);  // Verifica los datos en la consola

        // Añadir puntos para cada migrante
        data.forEach(function(d) {
            // Puntos de origen
            svg.append("circle")
                .attr("class", "migrant-origin")
                .attr("cx", projection([d.lon_origen, d.lat_origen])[0])
                .attr("cy", projection([d.lon_origen, d.lat_origen])[1])
                .attr("r", 5)
                .attr("fill", "red")
                .on("click", function() {
                    d3.select("#info").html(`
                        <h3>${d.nombre}</h3>
                        <p><strong>Edad:</strong> ${d.edad}</p>
                        <p><strong>País de Origen:</strong> ${d.pais_origen}</p>
                        <p><strong>País de Destino:</strong> ${d.pais_destino}</p>
                        <p><strong>Fecha de Migración:</strong> ${d.fecha_migracion}</p>
                    `);
                });

            // Puntos de destino
            svg.append("circle")
                .attr("class", "migrant-destination")
                .attr("cx", projection([d.lon_destino, d.lat_destino])[0])
                .attr("cy", projection([d.lon_destino, d.lat_destino])[1])
                .attr("r", 5)
                .attr("fill", "blue")
                .on("click", function() {
                    d3.select("#info").html(`
                        <h3>${d.nombre}</h3>
                        <p><strong>Edad:</strong> ${d.edad}</p>
                        <p><strong>País de Origen:</strong> ${d.pais_origen}</p>
                        <p><strong>País de Destino:</strong> ${d.pais_destino}</p>
                        <p><strong>Fecha de Migración:</strong> ${d.fecha_migracion}</p>
                    `);
                });
        });
    });
});
