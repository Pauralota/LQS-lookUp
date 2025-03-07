async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

    const urlCsv = 'https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRX-9kxzvaGlzDD1Y9C9TuogqOFGwLK-eIgzUi1BJ9GlkUpwA96QCJzU3Q4JFW2c7lH9rrgCeF-qkBE/pubhtml?gid=1778986479&single=true'; // Reemplaza con tu URL
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
            resultadosDiv.innerHTML = "<p>Codigo no encontrado.</p>";
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        resultadosDiv.innerHTML = "<p>Error al obtener los datos.</p>";
    }
}