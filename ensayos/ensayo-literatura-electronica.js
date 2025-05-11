// script.js

// 1) Cargamos datos desde data.json
d3.json("ensayo-literatura-electronica.json").then(full => {
  const data = full.data;
  drawTimeline(data);
  drawGraph(data);
}).catch(err => console.error("Error cargando data.json:", err));

// 2) Función para dibujar la línea de tiempo
function drawTimeline(data) {
  const margin = { top: 20, right: 30, bottom: 30, left: 100 },
        width = 800 - margin.left - margin.right,
        height = data.length * 20;

  const svg = d3.select("#timeline")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Escala de años
  const years = data.flatMap(d => d.fechas);
  const x = d3.scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width]);

  // Eje inferior
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Líneas por autor
  svg.selectAll("line")
    .data(data)
    .enter().append("line")
      .attr("x1", d => x(d.fechas[0]))
      .attr("x2", d => x(d.fechas[1]))
      .attr("y1", (_, i) => i * 20)
      .attr("y2", (_, i) => i * 20)
      .attr("stroke", "#333")
      .attr("stroke-width", 4);

  // Etiquetas de autor
  svg.selectAll("text")
    .data(data)
    .enter().append("text")
      .attr("x", d => x(d.fechas[0]) - 5)
      .attr("y", (_, i) => i * 20 + 5)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
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

  // Generar enlaces entre autores que comparten concepto
  const links = [];
  cmap.forEach(idxs => {
    for (let i=0; i<idxs.length; i++)
      for (let j=i+1; j<idxs.length; j++)
        links.push({ source: idxs[i], target: idxs[j] });
  });

  const width = 600, height = 400;
  const svg = d3.select("#graph")
    .append("svg")
      .attr("width", width)
      .attr("height", height);

  // Simulación de fuerza
  const sim = d3.forceSimulation(data)
    .force("link", d3.forceLink(links).id(d=>d.index).distance(100).strength(0.5))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width/2, height/2));

  // Dibujar enlaces
  const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke", "#aaa");

  // Dibujar nodos
  const node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("r", 10)
      .attr("fill", "#69b3a2")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

  // Etiquetas de nodos
  const label = svg.append("g")
    .selectAll("text")
    .data(data)
    .enter().append("text")
      .text(d => d.autor)
      .attr("dx", 12).attr("dy", 4)
      .attr("font-size", "10px");

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

  // Funciones de drag
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
