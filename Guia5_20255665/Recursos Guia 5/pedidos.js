// Cada pedido conserva el producto, el precio unitario y la cantidad solicitada.
const pedidos = [];
let precioMaximoActivo = null;

const formPedido = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#producto");
const inputPrecio = document.querySelector("#precio");
const inputCantidad = document.querySelector("#cantidad");
const inputPrecioMaximo = document.querySelector("#precioMaximo");
const cuerpoPedidos = document.querySelector("#cuerpoPedidos");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");
const estadoFiltro = document.querySelector("#estadoFiltro");
const mensaje = document.querySelector("#mensaje");

formPedido.addEventListener("submit", agregarPedido);
document.querySelector("#btnFiltrar").addEventListener("click", aplicarFiltro);
document.querySelector("#btnMostrarTodos").addEventListener("click", mostrarTodos);
document.querySelector("#btnLimpiar").addEventListener("click", limpiarPedidos);

// Estas funciones procesan los datos sin modificar la tabla.
function validarPedido(producto, precio, cantidad) {
    if (producto.length === 0) {
        return "Ingrese el nombre del producto.";
    }
    if (!Number.isFinite(precio) || precio <= 0) {
        return "El precio unitario debe ser un número mayor que cero.";
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        return "La cantidad debe ser un número entero positivo.";
    }
    return "";
}

function filtrarPedidos(lista, precioMaximo) {
    return lista.filter(pedido => precioMaximo === null || pedido.precio <= precioMaximo);
}

function calcularTotales(lista) {
    return lista.reduce((totales, pedido) => ({
        unidades: totales.unidades + pedido.cantidad,
        monto: totales.monto + pedido.precio * pedido.cantidad
    }), { unidades: 0, monto: 0 });
}

function formatearMoneda(valor) {
    return `$${valor.toFixed(2)}`;
}

// Las filas se crean con textContent para mostrar el nombre tal como se ingresó.
function mostrarTabla(lista) {
    const filas = lista.map(pedido => {
        const fila = document.createElement("tr");
        const valores = [
            pedido.producto,
            formatearMoneda(pedido.precio),
            pedido.cantidad,
            formatearMoneda(pedido.precio * pedido.cantidad)
        ];

        valores.forEach((valor, indice) => {
            const celda = document.createElement("td");
            celda.textContent = String(valor);
            if (indice > 0) {
                celda.className = "text-end";
            }
            fila.appendChild(celda);
        });
        return fila;
    });

    if (filas.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 4;
        celda.className = "text-center text-secondary py-4";
        celda.textContent = pedidos.length === 0
            ? "No hay pedidos registrados."
            : "No hay productos con el precio máximo indicado.";
        fila.appendChild(celda);
        filas.push(fila);
    }

    cuerpoPedidos.replaceChildren(...filas);
}

function actualizarVista() {
    mostrarTabla(filtrarPedidos(pedidos, precioMaximoActivo));

    // Los indicadores resumen todos los pedidos, incluso cuando se filtra la tabla.
    const totales = calcularTotales(pedidos);
    totalUnidades.textContent = String(totales.unidades);
    montoTotal.textContent = formatearMoneda(totales.monto);
    estadoFiltro.textContent = precioMaximoActivo === null
        ? "Mostrando todos los pedidos."
        : `Mostrando productos con precio unitario de hasta ${formatearMoneda(precioMaximoActivo)}.`;
}

function mostrarMensaje(texto, tipo = "danger") {
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo}`;
}

function ocultarMensaje() {
    mensaje.textContent = "";
    mensaje.className = "d-none";
}

function agregarPedido(evento) {
    evento.preventDefault();
    const producto = inputProducto.value.trim();
    const precio = Number(inputPrecio.value);
    const cantidad = Number(inputCantidad.value);
    const error = validarPedido(producto, precio, cantidad);

    if (error) {
        mostrarMensaje(error);
        return;
    }

    pedidos.push({ producto, precio, cantidad });
    actualizarVista();
    formPedido.reset();
    inputProducto.focus();
    mostrarMensaje("Pedido agregado correctamente.", "success");
}

function aplicarFiltro() {
    const valor = inputPrecioMaximo.value.trim();
    const precioMaximo = Number(valor);
    if (valor === "" || !Number.isFinite(precioMaximo) || precioMaximo < 0) {
        mostrarMensaje("Ingrese un precio máximo válido, mayor o igual que cero.");
        return;
    }

    precioMaximoActivo = precioMaximo;
    actualizarVista();
    ocultarMensaje();
}

function mostrarTodos() {
    precioMaximoActivo = null;
    inputPrecioMaximo.value = "";
    actualizarVista();
    ocultarMensaje();
}

function limpiarPedidos() {
    pedidos.length = 0;
    precioMaximoActivo = null;
    inputPrecioMaximo.value = "";
    formPedido.reset();
    actualizarVista();
    mostrarMensaje("Se limpiaron todos los pedidos.", "success");
}

actualizarVista();
