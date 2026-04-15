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
      const resultados = [
      // Hoja 1 (estructura original)
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
          maquina: fila[2] || "",
          ubicacion: fila[3] || "",
          cantidad: fila[4] || "",
          origen: "Hoja 1"
        })),
    
      // Hoja 2 (estructura nueva)
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
          maquina: "",              // no existe en esta hoja
          ubicacion: "",            // no existe
          cantidad: fila[4] || "",  // stock
          fecha: fila[6] || "",
          notas: fila[7] || "",
          origen: "Hoja 2"
        }))
    ];
    } else {
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
    }

  } catch (error) {
    console.error("Error al obtener los datos:", error);
    resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
  }
}

