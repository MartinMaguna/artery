document.getElementById('btn').addEventListener('click', () => {
  const frase = "El elefante tomó un bocado!";
  const analisis = RiTa.analyze(frase);
  const tokens = RiTa.tokenize(frase);
  const rimas = RiTa.rhymes("bocado");

  document.getElementById('output').textContent =
    `Análisis:\n${JSON.stringify(analisis, null, 2)}\n\n` +
    `Tokens:\n${tokens.join(", ")}\n\n` +
    `Rimas para 'bocado':\n${rimas.join(", ")}`;
});
