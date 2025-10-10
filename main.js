let writer;
let generatebtn = document.getElementById("generate");
generatebtn.addEventListener('click', async (event) => {

    //Seleccionar elementos del DOM
    const idea = document.getElementById("idea").value.trim();
    const tone = document.getElementById("tono").value;
    const length = document.getElementById("length").value;
    const output = document.getElementById("output");

    //Mensaje de espera
    output.textContent = " ⌛ Comprobando disponibilidad... ⌛"
    //Comprobrar si mi navegador es copatible con writer
    if (!Writer in self) {
        Output.textContent = "❌ Esta versión de navegador no admite el API de writer";
    }

    //Comprobar disponibilidad 
    const disponible = await Writer.availability();
    if (disponible === "unavailable") {
        output.textContent = "⛓️‍💥 El servicio de Writer no está disponible en este momento";
    }
    //Definir las opciones del prompt
    const options = {
        tone,
        length,
        format: "plain-text",
        sharedContext: "Contenido generado desde una idea inicial del usuario",
        language: "es"
    };

    //Crear instancia al modelo writer

    if (disponible === "available") {
        writer = await Writer.create(options);
    } else {
        writer = await Writer.create({
            monitor(m) {
                addEventListener("downloadprogress", e => {
                    output.textContent = "Descargando modelo de ia local: " + Math.round(e.loaded * 100) + "%";
                });
            }
        })
    }

    //Generar texto
    output.textContent = "Generando texto... ✍️";

    const result = await writer.write(idea, {
        ...options,
        context: "Ayuda al usuaria de escribir desde su idea de forma breve"
    });

    output.textContent = result;

});
