// Generamos un número aleatorio que se encuentre en el rango del 1 al 25.
const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
// Creamos una constante que permite identificar el máximo de intentos.
const numeroIntentos = 3;
// Guarda el número de intentos que realiza el usuario.
let intentos = 1;

function generarNumeroAleatorio() {
    // Definimos una variable para impresión de mensajes.
    let mensaje;
    // Utilizamos el DOM para acceder al párrafo creado.
    const parrafo = document.querySelector("#idParrafo");

    // Verificamos en qué intento está el usuario.
    if (intentos <= numeroIntentos) {
        let numero = prompt(
            "¿Qué número se ha generado (Intento " + intentos + ")?"
        );

        // Verificamos el número aleatorio con el ingresado por el usuario.
        if (numero == numeroAleatorio) {
            mensaje = `¡Es sorprendente, pudiste adivinar el número oculto (${numeroAleatorio}).
                Refresque la página para volver a jugar.`;
        } else {
            // Damos una pista según el número ingresado por el usuario.
            const pista = numeroAleatorio > numero
                ? "El número que buscas es más alto."
                : numeroAleatorio < numero
                    ? "El número que buscas es más bajo."
                    : "Ingrese un número válido para recibir una pista.";

            if (intentos == numeroIntentos) {
                mensaje = `${pista} Su número de intentos ha terminado.
                    El número oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
            } else {
                mensaje = `${pista} Vuelve a intentar. Quedan ${
                    numeroIntentos - intentos
                } intentos`;
            }
        }

        // Aumentamos el valor de los intentos.
        intentos++;
    } else {
        mensaje = `Su número de intentos ha terminado.
            El número oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
    }

    parrafo.innerHTML = mensaje;
}
