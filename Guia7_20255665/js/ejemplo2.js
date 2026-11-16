// Referencias del formulario y modal
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});
const bodyModal = document.getElementById("idBodyModal");
const modalLabel = document.getElementById("modalLabel");

// Función auxiliar para crear cada fila (tr) de la tabla usando solo métodos DOM
const crearFilaTabla = (campo, valor) => {
    const tr = document.createElement("tr");

    const tdCampo = document.createElement("td");
    const strong = document.createElement("strong");
    strong.appendChild(document.createTextNode(campo));
    tdCampo.appendChild(strong);

    const tdValor = document.createElement("td");
    tdValor.appendChild(document.createTextNode(valor));

    tr.appendChild(tdCampo);
    tr.appendChild(tdValor);
    return tr;
};

const validarYMostrarFormulario = () => {
    // Captura directa usando los IDs de ejemplo2.html
    const nombres = document.getElementById("idNombre").value.trim();
    const apellidos = document.getElementById("idApellidos").value.trim();
    const fechaNac = document.getElementById("idFechaNac").value;
    const correo = document.getElementById("idCorreo").value.trim();
    const password = document.getElementById("idPassword").value;
    const repetirPassword = document.getElementById("idPasswordRepetir").value;
    const selectPais = document.getElementById("idCmPais");
    const inputArchivo = document.getElementById("idArchivo");

    // Captura de checkboxes seleccionados y radio seleccionado
    const interesesSeleccionados = formulario.querySelectorAll('input[type="checkbox"]:checked');
    const carreraSeleccionada = formulario.querySelector('input[name="idRdCarrera"]:checked');

    let errores = [];

    // a. Validar que los campos no estén vacíos
    if (nombres === "") errores.push("El campo Nombres es obligatorio.");
    if (apellidos === "") errores.push("El campo Apellidos es obligatorio.");
    if (fechaNac === "") errores.push("Debe seleccionar su Fecha de nacimiento.");
    if (correo === "") errores.push("El campo Correo electrónico es obligatorio.");
    if (password === "") errores.push("Debe ingresar una Contraseña.");
    if (repetirPassword === "") errores.push("Debe repetir su Contraseña.");

    // b. Validar que la fecha de nacimiento no supere la fecha actual
    if (fechaNac !== "") {
        const fechaIngresada = new Date(fechaNac + "T00:00:00");
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaIngresada > hoy) {
            errores.push("La fecha de nacimiento no puede superar la fecha actual.");
        }
    }

    // c. Validar correo electrónico mediante expresión regular
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo !== "" && !regexCorreo.test(correo)) {
        errores.push("Ingrese un correo electrónico válido (ejemplo@dominio.com).");
    }

    // d. Validar que contraseña y repetir contraseña sean iguales
    if (password !== "" && repetirPassword !== "" && password !== repetirPassword) {
        errores.push("Las contraseñas ingresadas no coinciden.");
    }

    // e. Verificar que esté seleccionada al menos una opción en "algunos intereses"
    if (interesesSeleccionados.length === 0) {
        errores.push("Debe seleccionar al menos un interés.");
    }

    // f. Verificar que el usuario seleccione una carrera
    if (!carreraSeleccionada) {
        errores.push("Debe seleccionar la carrera que estudia.");
    }

    // g. Verificar que sea seleccionado un país de origen (index 0 es "Seleccione una opcion")
    if (selectPais.selectedIndex === 0) {
        errores.push("Debe seleccionar un país de origen.");
    }

    // Si hay errores, mostrar alerta y detener ejecución
    if (errores.length > 0) {
        alert("Por favor corrija lo siguiente:\n\n• " + errores.join("\n• "));
        return;
    }

    // Cambiar título del modal usando nodos DOM (sin innerHTML)
    while (modalLabel.firstChild) {
        modalLabel.removeChild(modalLabel.firstChild);
    }
    modalLabel.appendChild(document.createTextNode("Datos de Registro Validados"));

    // Limpiar contenido anterior del cuerpo del modal
    while (bodyModal.firstChild) {
        bodyModal.removeChild(bodyModal.firstChild);
    }

    // Crear tabla con Bootstrap usando exclusivamente métodos DOM
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-striped table-bordered");

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const thCampo = document.createElement("th");
    thCampo.appendChild(document.createTextNode("Campo"));

    const thValor = document.createElement("th");
    thValor.appendChild(document.createTextNode("Valor"));

    trHead.appendChild(thCampo);
    trHead.appendChild(thValor);
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Obtener el texto del <label> asociado a cada checkbox seleccionado
    const listaIntereses = Array.from(interesesSeleccionados)
        .map((checkbox) => {
            const label = formulario.querySelector(`label[for="${checkbox.id}"]`);
            return label ? label.textContent.trim() : checkbox.id;
        })
        .join(", ");

    // Obtener el texto del <label> asociado al radio seleccionado
    const labelCarrera = formulario.querySelector(`label[for="${carreraSeleccionada.id}"]`);
    const textoCarrera = labelCarrera ? labelCarrera.textContent.trim() : carreraSeleccionada.id;

    // Obtener texto del país y nombre del archivo (si subió uno)
    const textoPais = selectPais.options[selectPais.selectedIndex].text;
    const nombreArchivo =
        inputArchivo.files.length > 0 ? inputArchivo.files[0].name : "No seleccionado";

    // Agregar filas al tbody
    tbody.appendChild(crearFilaTabla("Nombres", nombres));
    tbody.appendChild(crearFilaTabla("Apellidos", apellidos));
    tbody.appendChild(crearFilaTabla("Fecha de nacimiento", fechaNac));
    tbody.appendChild(crearFilaTabla("Correo electrónico", correo));
    tbody.appendChild(crearFilaTabla("Intereses", listaIntereses));
    tbody.appendChild(crearFilaTabla("Carrera", textoCarrera));
    tbody.appendChild(crearFilaTabla("País de origen", textoPais));
    tbody.appendChild(crearFilaTabla("Avatar", nombreArchivo));

    tabla.appendChild(tbody);
    bodyModal.appendChild(tabla);

    // Mostrar el modal
    modal.show();
};

// Evento clic del botón Enviar registro
button.onclick = () => {
    validarYMostrarFormulario();
};