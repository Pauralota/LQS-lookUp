async function buscarCodigo() {
    const codigo = document.getElementById("codigoInput").value;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

    const urlApiOriginal = `https://script.google.com/macros/s/AKfycbws8VcpqPDMJik1lHDrYJGC8fdRaaMlOMXnZYUTiMusg06CiI1vp1Fnq_-On7TVjjAW/exec?codigo=${encodeURIComponent(codigo)}`;
    const urlCsv = `https://corsproxy.io/?${encodeURIComponent(urlApiOriginal)}`;

    try {
    const respuesta = await fetch(urlCsv);
    const data = await respuesta.json();

    if (data.error) {
        resultadosDiv.innerHTML = `<p>❌ ${data.error}</p>`;
    } else {
        resultadosDiv.innerHTML = `<p>✅ Fila: ${data.fila}</p><p>Ubicación: ${data.ubicacion}</p><p>Descripción: ${data.descripcion}</p>`;
    }
} catch (error) {
    console.error("Error al obtener los datos:", error);
    resultadosDiv.innerHTML = "<p>🚫 Error al obtener los datos.</p>";
}
}
