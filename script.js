async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value.trim();
    const descripcion = document.getElementById("descripcionInput").value.trim();
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

    const urlCsv = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv`;

    try {
        const respuesta = await fetch(urlCsv);
        const textoCsv = await respuesta.text();
        const parsed = Papa.parse(textoCsv, { header: false });
        const datos = parsed.data;

        // Crear regex para código y descripción (si hay texto)
        const regexCodigo = codigo ? new RegExp("^" + codigo.replace(/\*/g, ".*") + "$", "i") : null;
        const regexDescripcion = descripcion ? new RegExp(descripcion.replace(/\*/g, ".*"), "i") : null;

        const resultados = datos.filter(fila => {
            if (!fila || !fila[0]) return false;
            const matchCodigo = regexCodigo ? regexCodigo.test(fila[0].trim()) : true;
            const matchDescripcion = regexDescripcion ? regexDescripcion.test(fila[1]?.trim() || "") : true;
            return matchCodigo && matchDescripcion;
        });

        if (resultados.length === 0) {
            resultadosDiv.innerHTML = "<p>Código no encontrado.</p>";
            return;
        }

        // Si hay un solo resultado, mostrar detalle
        if (resultados.length === 1) {
            const fila = resultados[0];
            resultadosDiv.innerHTML = `
                <p><b>Encontrado!</b></p>
                <p>Ubicación: ${fila[3] ? fila[3].trim() : ''}</p>
                <p>Descripción: ${fila[1] ? fila[1].trim() : ''}</p>
                <p>Máquina: ${fila[2] ? fila[2].trim() : ''}</p>
                <p>Cantidad: ${fila[4] ? fila[4].trim() : ''}</p>
            `;
        } else {
            // Si hay varios resultados, mostrar tabla
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
                        <td>${fila[0] ? fila[0].trim() : ''}</td>
                        <td>${fila[1] ? fila[1].trim() : ''}</td>
                        <td>${fila[2] ? fila[2].trim() : ''}</td>
                        <td>${fila[3] ? fila[3].trim() : ''}</td>
                        <td>${fila[4] ? fila[4].trim() : ''}</td>
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
