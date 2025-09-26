async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value.trim();
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "⏳ Buscando..."; // Limpiar resultados anteriores

    const urlApiOriginal = `https://script.google.com/macros/s/AKfycbws8VcpqPDMJik1lHDrYJGC8fdRaaMlOMXnZYUTiMusg06CiI1vp1Fnq_-On7TVjjAW/exec?codigo=${encodeURIComponent(codigo)}`;
    const urlCsv = `https://corsproxy.io/?${encodeURIComponent(urlApiOriginal)}`;
    const urlCsv2 = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv
    
    try {
    const resp = await fetch(urlCsv);
    const texto = await resp.text();

    const filas = texto.split("\n").map(f => f.split(","));
    let encontrado = false;

    for (let i = 0; i < filas.length; i++) {
      if (filas[i][0] === codigo) { // Columna A
        resultadosDiv.innerHTML = `
          <p>✅ Fila: ${i + 1}</p>
          <p><strong>Ubicación:</strong> ${filas[i][1]}</p>
          <p><strong>Descripción:</strong> ${filas[i][2]}</p>
        `;
        encontrado = true;
        break;
      }
    }

    if (!encontrado) {
      resultadosDiv.innerHTML = "<p>❌ Código no encontrado</p>";
    }
  } catch (err) {
    console.error("Error al obtener datos:", err);
    resultadosDiv.innerHTML = "<p>🚫 Error al obtener los datos</p>";
  }
}
