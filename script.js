async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

    const urlCsv = `https://script.google.com/macros/s/AKfycbws8VcpqPDMJik1lHDrYJGC8fdRaaMlOMXnZYUTiMusg06CiI1vp1Fnq_-On7TVjjAW/exec?codigo=${encodeURIComponent(codigo)}`;
    try {
        const respuesta = await fetch(urlCsv);
        const textoCsv = await respuesta.text();
        const filas = textoCsv.split('\n');
        const datos = filas.map(fila => fila.split(','));
		
        let encontrado = false;
        for (const fila of datos) {
            if (fila[0] === codigo) {
                encontrado = true;
                resultadosDiv.innerHTML = `<p>Ubicacion: ${fila[1]}</p><p>Descripcion: ${fila[2]}</p>`;
                break;
            }
        }
        if (!encontrado) {
            resultadosDiv.innerHTML = "<p>Codigo noN encontrado.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
    }
}
