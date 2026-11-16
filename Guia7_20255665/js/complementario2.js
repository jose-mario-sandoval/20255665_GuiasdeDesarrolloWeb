// Configuración de RapidAPI (Free-to-Play Games Database)
const API_HOST = "free-to-play-games-database.p.rapidapi.com";
const API_KEY = "ffdfd60e5dmsh57b7d816879b1cap1a7cddjsndda00d73b07d"; // <-- Pega aquí tu X-RapidAPI-Key

const URL_LISTADO = `https://${API_HOST}/api/games`;
const URL_DETALLE = `https://${API_HOST}/api/game`;

const opcionesFetch = {
    method: "GET",
    headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
    },
};

// Referencias al DOM
const contenedorEstado = document.getElementById("idEstado");
const contenedorListado = document.getElementById("idListado");
const btnCargar = document.getElementById("idBtnCargar");

const modalDetalle = new bootstrap.Modal(document.getElementById("idModalDetalle"));
const modalTitulo = document.getElementById("idModalTitulo");
const modalCuerpo = document.getElementById("idModalCuerpo");

// Función auxiliar para limpiar hijos de un nodo
const limpiarNodo = (nodo) => {
    while (nodo.firstChild) {
        nodo.removeChild(nodo.firstChild);
    }
};

// Función para mostrar mensajes de carga o error en pantalla
const mostrarMensajeEstado = (texto, tipo = "info") => {
    limpiarNodo(contenedorEstado);
    if (!texto) return;

    const alerta = document.createElement("div");
    alerta.setAttribute("class", `alert alert-${tipo} text-center fw-bold`);
    alerta.setAttribute("role", "alert");
    alerta.appendChild(document.createTextNode(texto));

    contenedorEstado.appendChild(alerta);
};

// ENDPOINT 1: Obtener listado de recursos
const obtenerListadoJuegos = async () => {
    mostrarMensajeEstado("Cargando catálogo de videojuegos, por favor espere...", "info");
    limpiarNodo(contenedorListado);

    try {
        const respuesta = await fetch(URL_LISTADO, opcionesFetch);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}: No se pudo obtener el listado.`);
        }

        const datos = await respuesta.json();
        mostrarMensajeEstado(""); // Limpiar mensaje de carga

        // Tomamos los primeros 12 resultados para mantener una interfaz limpia
        const juegos = datos.slice(0, 12);
        renderizarListado(juegos);
    } catch (error) {
        console.error("Error al consultar listado:", error);
        mostrarMensajeEstado(
            `Ocurrió un error al cargar los datos: ${error.message}. Verifique su API Key o conexión.`,
            "danger"
        );
    }
};

// Construir tarjetas del listado usando métodos DOM
const renderizarListado = (juegos) => {
    juegos.forEach((juego) => {
        const col = document.createElement("div");
        col.setAttribute("class", "col");

        const card = document.createElement("div");
        card.setAttribute("class", "card h-100 shadow-sm");

        const img = document.createElement("img");
        img.setAttribute("src", juego.thumbnail);
        img.setAttribute("class", "card-img-top");
        img.setAttribute("alt", juego.title);

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body d-flex flex-column");

        const titulo = document.createElement("h5");
        titulo.setAttribute("class", "card-title fw-bold");
        titulo.appendChild(document.createTextNode(juego.title));

        const badge = document.createElement("span");
        badge.setAttribute("class", "badge bg-secondary mb-2 align-self-start");
        badge.appendChild(document.createTextNode(`${juego.genre} • ${juego.platform}`));

        const descripcion = document.createElement("p");
        descripcion.setAttribute("class", "card-text text-muted small flex-grow-1");
        descripcion.appendChild(document.createTextNode(juego.short_description));

        const btnDetalle = document.createElement("button");
        btnDetalle.setAttribute("type", "button");
        btnDetalle.setAttribute("class", "btn btn-primary mt-3");
        btnDetalle.appendChild(document.createTextNode("Ver detalles"));

        // Evento para consultar el segundo endpoint sin recargar la página
        btnDetalle.onclick = () => {
            obtenerDetalleJuego(juego.id);
        };

        cardBody.appendChild(titulo);
        cardBody.appendChild(badge);
        cardBody.appendChild(descripcion);
        cardBody.appendChild(btnDetalle);

        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);

        contenedorListado.appendChild(col);
    });
};

// ENDPOINT 2: Obtener detalle de un recurso seleccionado por ID
const obtenerDetalleJuego = async (idJuego) => {
    limpiarNodo(modalTitulo);
    modalTitulo.appendChild(document.createTextNode("Cargando información..."));

    limpiarNodo(modalCuerpo);
    const pCargando = document.createElement("p");
    pCargando.setAttribute("class", "text-center my-4");
    pCargando.appendChild(document.createTextNode("Obteniendo detalles del servidor..."));
    modalCuerpo.appendChild(pCargando);

    modalDetalle.show();

    try {
        const respuesta = await fetch(`${URL_DETALLE}?id=${idJuego}`, opcionesFetch);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}: No se encontró el detalle.`);
        }

        const detalle = await respuesta.json();
        renderizarDetalleModal(detalle);
    } catch (error) {
        console.error("Error al consultar detalle:", error);
        limpiarNodo(modalTitulo);
        modalTitulo.appendChild(document.createTextNode("Error de consulta"));

        limpiarNodo(modalCuerpo);
        const alertaError = document.createElement("div");
        alertaError.setAttribute("class", "alert alert-danger");
        alertaError.appendChild(
            document.createTextNode(`No se pudieron cargar los detalles: ${error.message}`)
        );
        modalCuerpo.appendChild(alertaError);
    }
};

// Construir contenido del modal con los detalles obtenidos
const renderizarDetalleModal = (detalle) => {
    limpiarNodo(modalTitulo);
    modalTitulo.appendChild(document.createTextNode(detalle.title));

    limpiarNodo(modalCuerpo);

    const img = document.createElement("img");
    img.setAttribute("src", detalle.thumbnail);
    img.setAttribute("class", "img-fluid rounded mb-3 w-100");
    img.setAttribute("alt", detalle.title);

    const pDesc = document.createElement("p");
    pDesc.appendChild(document.createTextNode(detalle.description));

    const lista = document.createElement("ul");
    lista.setAttribute("class", "list-group list-group-flush mt-3");

    const datosExtra = [
        { etiqueta: "Género", valor: detalle.genre },
        { etiqueta: "Plataforma", valor: detalle.platform },
        { etiqueta: "Desarrollador", valor: detalle.developer },
        { etiqueta: "Publicador", valor: detalle.publisher },
        { etiqueta: "Fecha de lanzamiento", valor: detalle.release_date },
        { etiqueta: "Estado", valor: detalle.status },
    ];

    datosExtra.forEach((item) => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");

        const strong = document.createElement("strong");
        strong.appendChild(document.createTextNode(`${item.etiqueta}: `));

        li.appendChild(strong);
        li.appendChild(document.createTextNode(item.valor || "No disponible"));
        lista.appendChild(li);
    });

    modalCuerpo.appendChild(img);
    modalCuerpo.appendChild(pDesc);
    modalCuerpo.appendChild(lista);
};

// Inicializar carga al abrir la página y al pulsar el botón
btnCargar.onclick = () => obtenerListadoJuegos();
document.addEventListener("DOMContentLoaded", obtenerListadoJuegos);