async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

    const urlCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnGbFqRCkn7AaKDgMQK3gCeQaLGvLqINj8L2N6kw83hX8_la5Em4SQupaFELc9qAkgDQ-uPiGvxVpx/pub?gid=1487045021&single=true&output=csv'; // Reemplaza con tu URL
    try {
        const respuesta = await fetch(urlCsv);
        const textoCsv = await respuesta.text();
        const filas = textoCsv.split('\n');
        const datos = filas.map(fila => fila.split(','));
		
        let encontrado = false;
        for (const fila of datos) {
            if (fila[0] === codigo) {
                encontrado = true;
                resultadosDiv.innerHTML = '<p>Ubicacion: ${fila[1]}</p><p>Descripcion: ${fila[2]}</p>';
                break;
            }
        }
        if (!encontrado) {
            resultadosDiv.innerHTML = "<p>Codigo no encontrado.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
    }
}
