function convertirWildcardARegex(texto) {
  // Escapa TODOS los caracteres especiales de regex
  const escapado = texto.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
  // Luego convierte el * en comodín
  const regexTexto = escapado.replace(/\*/g, '.*');
  return new RegExp("^" + regexTexto + "$", "i");
}

async function obtenerDatos(urlCsv) {
  const respuesta = await fetch(urlCsv);
  const textoCsv = await respuesta.text();

  const parsed = Papa.parse(textoCsv, {
    header: false,
    skipEmptyLines: true
  });

  return parsed.data.filter(row => row[0]);
}

async function buscarCodigo() {
  const codigo = document.getElementById("codigoInput").value.trim();
  const descripcion = document.getElementById("descripcionInput").value.trim();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  const urlCsv1 = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv`;
  const urlCsv2 = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=0&single=true&output=csv`;

  try {
    // 🔥 Cargar ambas hojas en paralelo
    const [datos1, datos2] = await Promise.all([
      obtenerDatos(urlCsv1),
      obtenerDatos(urlCsv2)
    ]);

    const codigoRegex = codigo ? convertirWildcardARegex(codigo) : null;
    const descRegex = descripcion ? convertirWildcardARegex(descripcion) : null;

    // 🔥 NORMALIZAMOS DATOS
    const resultados = [

      // Hoja 1
      ...datos1
        .filter(fila => {
          const cod = String(fila[0] || "").trim();
          const desc = String(fila[1] || "").trim();
          return (!codigoRegex || codigoRegex.test(cod)) &&
                 (!descRegex || descRegex.test(desc));
        })
        .map(fila => ({
          codigo: fila[0] || "",
          descripcion: fila[1] || "",
          cantidad: fila[4] || "",
          fecha: "",
          notas: "",
          origen: "clasificado LQS"
        })),

      // Hoja 2
      ...datos2
        .filter(fila => {
          const cod = String(fila[0] || "").trim();
          const desc = String(fila[3] || "").trim();
          return (!codigoRegex || codigoRegex.test(cod)) &&
                 (!descRegex || descRegex.test(desc));
        })
        .map(fila => ({
          codigo: fila[0] || "",
          descripcion: fila[3] || "",
          cantidad: fila[4] || "",
          fecha: fila[6] || "",
          notas: fila[7] || "",
          origen: "Recup sin clasif."
        }))
    ];

    if (resultados.length === 0) {
      resultadosDiv.innerHTML = "<p>No se encontraron coincidencias.</p>";
      return;
    }

    // 🔥 TABLA FINAL
    let tabla = `
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Fecha</th>
            <th>Notas</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const fila of resultados) {
      tabla += `
        <tr>
          <td>${fila.codigo?.trim() || ''}</td>
          <td>${fila.descripcion?.trim() || ''}</td>
          <td>${fila.cantidad?.trim() || ''}</td>
          <td>${fila.fecha?.trim() || ''}</td>
          <td>${fila.notas?.trim() || ''}</td>
          <td>${fila.origen}</td>
        </tr>
      `;
    }

    tabla += "</tbody></table>";
    resultadosDiv.innerHTML = tabla;

  } catch (error) {
    console.error("Error:", error);
    resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
  }
}

