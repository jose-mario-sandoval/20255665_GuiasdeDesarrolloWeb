document.addEventListener("DOMContentLoaded", function () {
    const containerEstudiantes = document.querySelector("#idContainerEstudiantes");
    const btnAddEstudiante = document.querySelector("#idBtnAgregarEstudiante");
    const btnViewEstudiantes = document.querySelector("#idBtnMostrarEstudiantes");

    btnAddEstudiante.addEventListener("click", addEstudiantes);
    btnViewEstudiantes.addEventListener("click", viewEstudiantes);

    // Cada fila del arreglo contiene carnet, nombres y apellidos.
    let arrayEstudiantes = new Array();

    function addEstudiantes() {
        const inputCarnet = document.querySelector("#inputCarnet").value.toString().toUpperCase();
        const inputNombre = document.querySelector("#inputNombre").value.toString().toUpperCase();
        const inputApellidos = document.querySelector("#inputApellidos").value.toString().toUpperCase();

        if (inputCarnet != "" && inputNombre != "" && inputApellidos != "") {
            arrayEstudiantes.push(new Array(inputCarnet, inputNombre, inputApellidos));
            alert("Se registro el nuevo estudiante");
            document.querySelector("#inputCarnet").value = "";
            document.querySelector("#inputNombre").value = "";
            document.querySelector("#inputApellidos").value = "";
            document.querySelector("#inputCarnet").focus();
        } else {
            alert("Faltan campos que completar");
        }
    }

    function viewEstudiantes() {
        let totalEstudiantes = arrayEstudiantes.length;
        if (totalEstudiantes > 0) {
            let table = "<table class='table table-light table-striped'>";
            table += "<thead><tr>";
            table += "<th scope='col' style='width: 5%;'>#</th>";
            table += "<th scope='col' style='width: 15%;'>Carnet</th>";
            table += "<th scope='col'>Nombres</th><th scope='col'>Apellidos</th>";
            table += "</tr></thead><tbody>";

            for (let i = 0; i < arrayEstudiantes.length; i++) {
                let carnet = arrayEstudiantes[i][0];
                let nombres = arrayEstudiantes[i][1];
                let apellidos = arrayEstudiantes[i][2];
                table += `<tr><td scope='row' style='font-weight: bold;'>${i + 1}</td>`;
                table += `<td>${carnet}</td><td>${nombres}</td><td>${apellidos}</td></tr>`;
            }

            table += "</tbody></table>";
            containerEstudiantes.innerHTML = table;
        } else {
            alert("No se han registrado estudiantes");
        }
    }
});
