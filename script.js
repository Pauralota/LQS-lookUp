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

  const urlCsv = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv`;
  const urlCsv2 = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=0&single=true&output=csv`;
  
  try {
    const respuesta = await fetch(urlCsv);
    const textoCsv = await respuesta.text();
    const parsed = Papa.parse(textoCsv, {
        header: false,
        skipEmptyLines: true
      });
    const datos = parsed.data.filter(row => row.length > 1);

    // Expresiones regulares con soporte de asteriscos
    const codigoRegex = codigo
      ? convertirWildcardARegex(codigo)
      : null;
    const descRegex = descripcion
      ? convertirWildcardARegex(descripcion)
      : null;
    
    console.log(datos.slice(0, 10));
    // Filtro de coincidencias
    const resultados = datos.filter(fila => {

      const valorCodigo = String(fila[0] || "").trim();
      const valorDescripcion = String(fila[1] || "").trim();
    
      console.log("Comparando:", valorCodigo, "con", codigoRegex);
  
      const cumpleCodigo = codigoRegex
        ? codigoRegex.test(valorCodigo)
        : true;
    
      const cumpleDescripcion = descRegex
        ? descRegex.test(valorDescripcion)
        : true;
    
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

