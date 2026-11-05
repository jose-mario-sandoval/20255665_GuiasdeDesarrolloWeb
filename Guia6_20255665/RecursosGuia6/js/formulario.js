const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");
const idModal = document.getElementById("idModal");

let arrayPaciente = [];
let indiceEdicion = null;
const clavePacientes = "guia6_20255665_pacientes";

function cargarPacientes() {
    try {
        const guardados = JSON.parse(localStorage.getItem(clavePacientes) || "[]");
        if (!Array.isArray(guardados) || !guardados.every((paciente) =>
            Array.isArray(paciente) && paciente.length === 6 && paciente.every((dato) => typeof dato === "string")
        )) {
            throw new Error("Formato de pacientes inválido");
        }
        arrayPaciente = guardados;
    } catch (error) {
        mensaje.textContent = "No se pudieron cargar los pacientes guardados";
        toast.show();
    }
}

function guardarPacientes(pacientes) {
    try {
        localStorage.setItem(clavePacientes, JSON.stringify(pacientes));
        return true;
    } catch (error) {
        mensaje.textContent = "No se pudo guardar el cambio en el almacenamiento del navegador";
        toast.show();
        return false;
    }
}

const limpiarForm = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";
    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;
    cmbPais.value = 0;
    inputDireccion.value = "";
    inputNombrePais.value = "";
    indiceEdicion = null;
    buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
    inputNombre.focus();
};

const addPaciente = function () {
    let nombre = inputNombre.value;
    let apellido = inputApellido.value;
    let fechaNacimiento = inputFechaNacimiento.value;
    let sexo = inputRdMasculino.checked == true ? "Hombre" : inputRdFemenino.checked == true ? "Mujer" : "";
    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
    let direccion = inputDireccion.value;

    if (nombre != "" && apellido != "" && fechaNacimiento != "" && sexo != "" && pais != 0 && direccion != "") {
        let paciente = new Array(nombre, apellido, fechaNacimiento, sexo, labelPais, direccion);
        const actualizados = arrayPaciente.slice();
        if (indiceEdicion === null) {
            actualizados.push(paciente);
        } else {
            actualizados[indiceEdicion] = paciente;
        }
        if (!guardarPacientes(actualizados)) return;
        arrayPaciente = actualizados;
        mensaje.textContent = indiceEdicion === null
            ? "Se ha registrado un nuevo paciente"
            : "Se han actualizado los datos del paciente";
        toast.show();
        imprimirPacientes();
        limpiarForm();
    } else {
        mensaje.innerHTML = "Faltan campos por completar";
        toast.show();
    }
};

const escaparHTML = (valor) => String(valor).replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[caracter]);

function imprimirFilas() {
    let fila = "";
    let contador = 1;
    arrayPaciente.forEach((element) => {
        fila += `<tr>
            <td scope="row" class="text-center fw-bold">${contador}</td>
            <td>${escaparHTML(element[0])}</td><td>${escaparHTML(element[1])}</td><td>${escaparHTML(element[2])}</td>
            <td>${escaparHTML(element[3])}</td><td>${escaparHTML(element[4])}</td><td>${escaparHTML(element[5])}</td>
            <td>
                <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" data-accion="editar" data-indice="${contador - 1}" aria-label="Editar paciente ${contador}" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" data-accion="eliminar" data-indice="${contador - 1}" aria-label="Eliminar paciente ${contador}" title="Eliminar">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        </tr>`;
        contador++;
    });
    return fila;
}

const imprimirPacientes = () => {
    if (arrayPaciente.length === 0) {
        document.getElementById("idTablaPacientes").textContent = "Ninguno";
        return;
    }
    let table = `<div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
            <thead><tr>
                <th scope="col" class="text-center" style="width:5%">#</th>
                <th scope="col" class="text-center" style="width:15%">Nombre</th>
                <th scope="col" class="text-center" style="width:15%">Apellido</th>
                <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                <th scope="col" class="text-center" style="width:10%">Sexo</th>
                <th scope="col" class="text-center" style="width:10%">País</th>
                <th scope="col" class="text-center" style="width:25%">Dirección</th>
                <th scope="col" class="text-center" style="width:10%">Opciones</th>
            </tr></thead>
            <tbody>${imprimirFilas()}</tbody>
        </table>
    </div>`;
    document.getElementById("idTablaPacientes").innerHTML = table;
};

let contadorGlobalOption = cmbPais.children.length;

function editarPaciente(indice) {
    const paciente = arrayPaciente[indice];
    if (!paciente) return;
    inputNombre.value = paciente[0];
    inputApellido.value = paciente[1];
    inputFechaNacimiento.value = paciente[2];
    inputRdMasculino.checked = paciente[3] === "Hombre";
    inputRdFemenino.checked = paciente[3] === "Mujer";
    let opcion = Array.from(cmbPais.options).find((item) => item.text === paciente[4]);
    if (!opcion) {
        opcion = document.createElement("option");
        opcion.textContent = paciente[4];
        opcion.value = ++contadorGlobalOption;
        cmbPais.appendChild(opcion);
    }
    cmbPais.value = opcion.value;
    inputDireccion.value = paciente[5];
    indiceEdicion = indice;
    buttonAgregarPaciente.innerHTML = '<i class="bi bi-pencil-square"></i> Guardar cambios';
    inputNombre.focus();
}

function eliminarPaciente(indice) {
    if (!Number.isInteger(indice) || indice < 0 || indice >= arrayPaciente.length) return;
    const actualizados = arrayPaciente.slice();
    actualizados.splice(indice, 1);
    if (!guardarPacientes(actualizados)) return;
    arrayPaciente = actualizados;
    if (indiceEdicion === indice) {
        limpiarForm();
    } else if (indiceEdicion !== null && indice < indiceEdicion) {
        indiceEdicion--;
    }
    imprimirPacientes();
    mensaje.innerHTML = "Se ha eliminado el paciente";
    toast.show();
}

// Un solo controlador atiende también los botones de las filas recién creadas.
document.getElementById("idTablaPacientes").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const indice = Number(boton.dataset.indice);
    if (boton.dataset.accion === "editar") editarPaciente(indice);
    if (boton.dataset.accion === "eliminar") eliminarPaciente(indice);
});

const addPais = () => {
    let paisNew = inputNombrePais.value;
    if (paisNew != "") {
        let option = document.createElement("option");
        option.textContent = paisNew;
        option.value = ++contadorGlobalOption;
        cmbPais.appendChild(option);
        mensaje.innerHTML = "País agregado correctamente";
        toast.show();
    } else {
        mensaje.innerHTML = "Faltan campos por completar";
        toast.show();
    }
};

buttonLimpiarPaciente.onclick = () => { limpiarForm(); };
buttonAgregarPaciente.onclick = () => { addPaciente(); };
buttonMostrarPaciente.onclick = () => { imprimirPacientes(); };
buttonAgregarPais.onclick = () => { addPais(); };

idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

limpiarForm();
cargarPacientes();
imprimirPacientes();
