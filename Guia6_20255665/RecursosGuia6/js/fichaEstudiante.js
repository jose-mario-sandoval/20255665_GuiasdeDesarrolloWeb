// ^ y $ delimitan el valor completo; test() devuelve si el patrón coincide.
// Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions
const reglas = {
    idCarnet: {
        patron: /^[A-Za-z]{2}\d{3}$/,
        mensaje: "Escribe dos letras y tres números, por ejemplo AB001."
    },
    idNombreCompleto: {
        patron: /^\p{L}[\p{L}\p{M}]*(?: +\p{L}[\p{L}\p{M}]*)+$/u,
        mensaje: "Escribe el nombre y apellido usando solo letras y espacios."
    },
    idDui: {
        patron: /^\d{8}-\d$/,
        mensaje: "Usa el formato 12345678-9."
    },
    idNit: {
        patron: /^\d{4}-\d{6}-\d{3}-\d$/,
        mensaje: "Usa el formato 1234-123456-123-4."
    },
    idFechaNacimiento: {
        patron: /^\d{4}-\d{2}-\d{2}$/,
        mensaje: "Selecciona una fecha de nacimiento válida en el calendario."
    },
    idCorreo: {
        patron: /^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/,
        mensaje: "Escribe un correo válido, por ejemplo estudiante@ejemplo.com."
    },
    idEdad: {
        patron: /^\d+$/,
        mensaje: "La edad debe contener solo números enteros, sin signos ni decimales."
    }
};

const formularioEstudiante = document.getElementById("idFormEstudiante");
const resultadoValidacion = document.getElementById("idResultadoValidacion");
const camposEstudiante = Object.keys(reglas).map((id) => document.getElementById(id));

function fechaExistente(valor) {
    const [anio, mes, dia] = valor.split("-").map(Number);
    const bisiesto = anio % 400 === 0 || (anio % 4 === 0 && anio % 100 !== 0);
    const diasPorMes = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return anio > 0 && mes >= 1 && mes <= 12 && dia >= 1 && dia <= diasPorMes[mes - 1];
}

function validarCampo(campo) {
    const regla = reglas[campo.id];
    const valor = campo.value.normalize("NFC");
    let valido = regla.patron.test(valor);
    if (valido && campo.id === "idFechaNacimiento") valido = fechaExistente(valor);
    if (valido && campo.id === "idCorreo") {
        const parteLocal = valor.split("@")[0];
        valido = !campo.validity.typeMismatch && !parteLocal.startsWith(".")
            && !parteLocal.endsWith(".") && !parteLocal.includes("..");
    }

    campo.setCustomValidity(valido ? "" : regla.mensaje);
    campo.classList.toggle("is-invalid", !valido);
    campo.classList.toggle("is-valid", valido);
    campo.setAttribute("aria-invalid", String(!valido));
    document.getElementById(campo.id + "Error").textContent = valido ? "" : regla.mensaje;
    return valido;
}

camposEstudiante.forEach((campo) => {
    campo.addEventListener("input", () => {
        resultadoValidacion.textContent = "";
        resultadoValidacion.className = "mt-3";
        validarCampo(campo);
    });
});

formularioEstudiante.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let primerError = null;
    camposEstudiante.forEach((campo) => {
        if (!validarCampo(campo) && primerError === null) primerError = campo;
    });
    resultadoValidacion.className = primerError ? "alert alert-danger mt-3" : "alert alert-success mt-3";
    resultadoValidacion.textContent = primerError ? "Revisa los campos indicados." : "Ficha de estudiante válida.";
    if (primerError) primerError.focus();
});

formularioEstudiante.addEventListener("reset", () => {
    camposEstudiante.forEach((campo) => {
        campo.setCustomValidity("");
        campo.classList.remove("is-valid", "is-invalid");
        campo.removeAttribute("aria-invalid");
        document.getElementById(campo.id + "Error").textContent = "";
    });
    resultadoValidacion.textContent = "";
    resultadoValidacion.className = "mt-3";
    camposEstudiante[0].focus();
});
