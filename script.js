async function buscarCodigo() {
  const codigo = document.getElementById("codigoInput").value.trim();
  const descripcion = document.getElementById("descripcionInput").value.trim();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  const urlCsv = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv`;

  try {
    const respuesta = await fetch(urlCsv);
    const textoCsv = await respuesta.text();
    const parsed = Papa.parse(textoCsv, { header: false });
    const datos = parsed.data.filter(row => row.length > 1);

    // Expresiones regulares con soporte de asteriscos
    const codigoRegex = codigo
      ? new RegExp("^" + codigo.replace(/\*/g, ".*") + "$", "i")
      : null;
    const descRegex = descripcion
      ? new RegExp(descripcion.replace(/\*/g, ".*"), "i")
      : null;

    // Filtro de coincidencias
    const resultados = datos.filter(fila => {
      const cumpleCodigo = codigoRegex ? codigoRegex.test(fila[0]?.trim()) : true;
      const cumpleDescripcion = descRegex ? descRegex.test(fila[1]?.trim()) : true;
      return cumpleCodigo && cumpleDescripcion;
    });

    // Mostrar resultados
    if (resultados.length === 0) {
      resultadosDiv.innerHTML = "<p>No se encontraron coincidencias.</p>";
      return;
    }

    if (resultados.length === 1) {
      const fila = resultados[0];
      resultadosDiv.innerHTML = `
        <p><b>Encontrado:</b></p>
        <p>Código: ${fila[0]?.trim() || ''}</p>
        <p>Descripción: ${fila[1]?.trim() || ''}</p>
        <p>Máquina: ${fila[2]?.trim() || ''}</p>
        <p>Ubicación: ${fila[3]?.trim() || ''}</p>
        <p>Cantidad: ${fila[4]?.trim() || ''}</p>
      `;
    } else {
      let tabla = `
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Máquina</th>
              <th>Ubicación</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
      `;
      for (const fila of resultados) {
        tabla += `
          <tr>
            <td>${fila[0]?.trim() || ''}</td>
            <td>${fila[1]?.trim() || ''}</td>
            <td>${fila[2]?.trim() || ''}</td>
            <td>${fila[3]?.trim() || ''}</td>
            <td>${fila[4]?.trim() || ''}</td>
          </tr>
        `;
      }
      tabla += "</tbody></table>";
      resultadosDiv.innerHTML = tabla;
    }

  } catch (error) {
    console.error("Error al obtener los datos:", error);
    resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
  }
}

