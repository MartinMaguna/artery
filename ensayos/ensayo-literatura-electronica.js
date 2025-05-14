// script.js

// 1) Cargamos datos desde data.json
d3.json("ensayo-literatura-electronica.json").then(full => {
  const data = full.data;
  drawTimeline(data);
  drawGraph(data);
}).catch(err => console.error("Error cargando data.json:", err));

// 2) Función para dibujar la línea de tiempo
function drawTimeline(data) {
  // Parámetros
  const margin = { top: 20, right: 30, bottom: 30, left: 100 },
        width = 800 - margin.left - margin.right,
        height = data.length * 25; // separo un poco más

  // Contenedor y overflow
  const container = d3.select("#timeline")
    .style("position", "relative")
    .style("overflow-x", "auto")
    .style("padding", "1rem")
    .style("background-color", "#fff")
    .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)")
    .style("border-radius", "8px")
    .style("margin-bottom", "2rem");

  // SVG
  const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escala de años
  const years = data.flatMap(d => d.fechas);
  const x = d3.scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width]);

  // Eje X
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#555");

  // Líneas por autor
  svg.selectAll("line.author")
    .data(data)
    .enter().append("line")
      .attr("class", "author")
      .attr("x1", d => x(d.fechas[0]))
      .attr("x2", d => x(d.fechas[1]))
      .attr("y1", (_, i) => i * 25)
      .attr("y2", (_, i) => i * 25)
      .style("stroke", "#333")
      .style("stroke-width", 4)
      .style("opacity", 0.8);

  // Etiquetas de autor
  svg.selectAll("text.label")
    .data(data)
    .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.fechas[0]) - 5)
      .attr("y", (_, i) => i * 25 + 5)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#333")
      .text(d => d.autor);
}

// 3) Función para dibujar el grafo de influencias
function drawGraph(data) {
  // Mapeo de conceptos a índices
  const cmap = new Map();
  data.forEach((d,i) => {
    d.index = i;
    d.conceptos.forEach(c => {
      if (!cmap.has(c)) cmap.set(c, []);
      cmap.get(c).push(i);
    });
  });

  // Generar enlaces
  const links = [];
  cmap.forEach(idxs => {
    for (let i=0; i<idxs.length; i++) {
      for (let j=i+1; j<idxs.length; j++) {
        links.push({ source: idxs[i], target: idxs[j] });
      }
    }
  });

  // Parámetros
  const width = 800,
        height = 500;

  // Contenedor y estilos
  const container = d3.select("#graph")
    .style("position", "relative")
    .style("overflow", "hidden")
    .style("padding", "1rem")
    .style("background-color", "#fff")
    .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)")
    .style("border-radius", "8px");

  // SVG
  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

  // Simulación
  const sim = d3.forceSimulation(data)
    .force("link", d3.forceLink(links).id(d=>d.index).distance(120).strength(0.4))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width/2, height/2));

  // Enlaces
  const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .style("stroke", "#aaa")
        .style("stroke-width", 1.5)
        .style("opacity", 0.7);

  // Nodos
  const node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
        .attr("r", 12)
        .style("fill", "#69b3a2")
        .style("stroke", "#fff")
        .style("stroke-width", 1.5)
        .style("cursor", "grab")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

  // Etiquetas
  const label = svg.append("g")
      .selectAll("text")
      .data(data)
      .enter().append("text")
        .text(d => d.autor)
        .attr("dx", 16)
        .attr("dy", 4)
        .style("font-size", "11px")
        .style("fill", "#333");

  // Tick
  sim.on("tick", () => {
    link
      .attr("x1", d=>d.source.x)
      .attr("y1", d=>d.source.y)
      .attr("x2", d=>d.target.x)
      .attr("y2", d=>d.target.y);

    node
      .attr("cx", d=>d.x)
      .attr("cy", d=>d.y);

    label
      .attr("x", d=>d.x)
      .attr("y", d=>d.y);
  });

  // Drag handlers
  function dragstarted(event,d) {
    if (!event.active) sim.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event,d) {
    d.fx = event.x; d.fy = event.y;
  }
  function dragended(event,d) {
    if (!event.active) sim.alphaTarget(0);
    d.fx = null; d.fy = null;
  }
}
