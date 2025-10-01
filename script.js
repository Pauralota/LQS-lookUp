async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

    const urlCsv = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv`; // Reemplaza con tu URL
    try {
        const respuesta = await fetch(urlCsv);
        const textoCsv = await respuesta.text();

		// Parsear con PapaParse
        const parsed = Papa.parse(textoCsv, {
		    header: false,       // no hay fila de encabezado
		    skipEmptyLines: true, // ignora filas vacías
		    dynamicTyping: false, // evita interpretar números automáticamente
		    quoteChar: '"',      // reconoce comillas dobles
		    delimiter: ",",      // el separador es coma
		});
		const datos = parsed.data;
        const datos = parsed.data;
		
        // const filas = textoCsv.split('\n');
        // const datos = filas.map(fila => fila.split(','));
		
        let encontrado = false;
        for (const fila of datos) {
            if (fila[0] === codigo) {
                encontrado = true;
                resultadosDiv.innerHTML = `
				<p><b>Encontrado!</b></p>
				<p>Ubicación: ${limpiar(fila[3]) ? limpiar(fila[3]).trim() : ''}</p>
				<p>Descripcion: ${limpiar(fila[1]) ? limpiar(fila[1]).trim() : ''}</p>
				<p>Máquina: ${limpiar(fila[2]) ? limpiar(fila[2]).trim() : ''}</p>
				<p>Cantidad: ${limpiar(fila[4]) ? limpiar(fila[4]).trim() : ''}</p>
                break;
            }
        }
        if (!encontrado) {
            resultadosDiv.innerHTML = "<p>Código no encontrado.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
    }
}

function limpiar(valor) {
    return valor ? valor.trim().replace(/^"(.*)"$/, '$1') : '';
}
