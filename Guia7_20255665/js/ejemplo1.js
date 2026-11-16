// ACCEDIENDO A LA REFERENCIA DEL FORMULARIO QUE
// TENDRA LOS NUEVOS ELEMENTOS
const newForm = document.getElementById("idNewForm");

// ACCEDIENDO A LA REFERENCIA DE BOTONES
const buttonCrear = document.getElementById("idBtnCrear");
const buttonAddElemento = document.getElementById("idBtnAddElement");

// ACCEDIENDO AL VALOR DEL SELECT PARA DETERMINAR EL TIPO DE ELEMENTO A CREAR
const cmbElemento = document.getElementById("idCmbElemento");

// ACCEDIENDO A LOS CONTROLES DEL MODAL
const tituloElemento = document.getElementById("idTituloElemento");
const nombreElemento = document.getElementById("idNombreElemento");

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// PASO 2
const vericarTipoElemento = function () {
    let elemento = cmbElemento.value;
    // Validando que se haya seleccionado un elemento
    if (elemento != "") {
        // Método perteneciente al modal de bootstrap
        modal.show();
    } else {
        alert("Debe seleccionar el elemento que se creara");
    }
};

// PASO 3
const newSelect = function () {
    // Creando elementos
    let addElemento = document.createElement("select");
    // Creando atributos para el nuevo elemento
    addElemento.setAttribute("id", `id${nombreElemento.value}`);
    addElemento.setAttribute("class", "form-select");

    // Creando option para el select
    for (let i = 1; i <= 10; i++) {
        let addOption = document.createElement("option");
        addOption.value = i;
        addOption.innerHTML = `Opcion ${i}`;
        addElemento.appendChild(addOption);
    }

    // Creando label para el nuevo control
    let labelElemento = document.createElement("label");
    labelElemento.setAttribute("for", `id${nombreElemento.value}`);
    // Creando texto para label
    labelElemento.textContent = tituloElemento.value;

    // Creando label de id
    let labelId = document.createElement("span");
    labelId.textContent = `ID de control : ${nombreElemento.value}`;

    // Creando plantilla de bootstrap para visualizar el nuevo elemento
    let divElemento = document.createElement("div");
    // Agregando atributos
    divElemento.setAttribute("class", "form-floating");

    // Creando el input que será hijo del div
    divElemento.appendChild(addElemento);
    // Creando el label que será hijo del div
    divElemento.appendChild(labelElemento);

    // Creando el SPAN que será hijo del nuevo Formulario
    newForm.appendChild(labelId);

    // Creando el Div que será hijo del nuevo Formulario
    newForm.appendChild(divElemento);
};

// PASO 4
const newRadioCheckbox = function (newElemento) {
    // Creando elementos
    let addElemento = document.createElement("input");
    // Creando atributos para el nuevo elemento
    addElemento.setAttribute("id", `id${nombreElemento.value}`);
    addElemento.setAttribute("type", newElemento);
    addElemento.setAttribute("class", "form-check-input");

    // Creando label para el nuevo control
    let labelElemento = document.createElement("label");
    labelElemento.setAttribute("class", "form-check-label");
    labelElemento.setAttribute("for", `id${nombreElemento.value}`);
    // Creando texto para label
    labelElemento.textContent = tituloElemento.value;

    // Creando label de id
    let labelId = document.createElement("span");
    labelId.textContent = `ID de control : ${nombreElemento.value}`;

    // Creando plantilla de bootstrap para visualizar el nuevo elemento
    let divElemento = document.createElement("div");
    // Agregando atributos
    divElemento.setAttribute("class", "form-check");

    // Creando el input que será hijo del div
    divElemento.appendChild(addElemento);
    // Creando el label que será hijo del div
    divElemento.appendChild(labelElemento);

    // Creando el SPAN que será hijo del nuevo Formulario
    newForm.appendChild(labelId);

    // Creando el Div que será hijo del nuevo Formulario
    newForm.appendChild(divElemento);
};

// PASO 5
const newInput = function (newElemento) {
    // Creando elementos de tipo = text, number, date y password
    let addElemento =
        newElemento == "textarea"
            ? document.createElement("textarea")
            : document.createElement("input");

    // Creando atributos para el nuevo elemento
    addElemento.setAttribute("id", `id${nombreElemento.value}`);
    addElemento.setAttribute("type", newElemento);
    addElemento.setAttribute("class", "form-control");
    addElemento.setAttribute("placeholder", tituloElemento.value);

    // Creando label para el nuevo control
    let labelElemento = document.createElement("label");
    labelElemento.setAttribute("for", `id${nombreElemento.value}`);

    // Creando icono para el label
    let iconLabel = document.createElement("i");
    iconLabel.setAttribute("class", "bi bi-tag");

    // Creando texto para label
    labelElemento.textContent = tituloElemento.value;

    // Creando el elemento i como hijo del label, afterbegin le
    // indicamos que se creará antes de su primer hijo
    labelElemento.insertAdjacentElement("afterbegin", iconLabel);

    // Creando label de id
    let labelId = document.createElement("span");
    labelId.textContent = `ID de control: ${nombreElemento.value}`;

    // Creando plantilla de bootstrap para visualizar el nuevo elemento
    let divElemento = document.createElement("div");
    // Agregando atributos
    divElemento.setAttribute("class", "form-floating mb-3");

    // Creando el input que será hijo del div
    divElemento.appendChild(addElemento);
    // Creando el label que será hijo del div
    divElemento.appendChild(labelElemento);

    // Creando el SPAN que será hijo del nuevo Formulario
    newForm.appendChild(labelId);

    // Creando el Div que será hijo del nuevo Formulario
    newForm.appendChild(divElemento);
};

// PASO 6
buttonCrear.onclick = () => {
    vericarTipoElemento();
};

buttonAddElemento.onclick = () => {
    if (nombreElemento.value != "" && tituloElemento.value != "") {
        let elemento = cmbElemento.value;

        if (elemento == "select") {
            newSelect();
        } else if (elemento == "radio" || elemento == "checkbox") {
            newRadioCheckbox(elemento);
        } else {
            newInput(elemento);
        }
    } else {
        alert("Faltan campos por completar");
    }
};

// PASO 7
document.getElementById("idModal").addEventListener("shown.bs.modal", () => {
    // Limpiando campos para los nuevos elementos
    tituloElemento.value = "";
    nombreElemento.value = "";
    // Inicializando puntero en el campo del título para el control
    tituloElemento.focus();
});