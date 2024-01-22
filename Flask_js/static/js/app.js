let get_registros = new XMLHttpRequest();

function get_registros_handler() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            const datos = JSON.parse(this.responseText);
            const registros = datos.data;

            // document.getElementById("table_registros").innerHTML = "<tr><th>Fecha</th><th>Hora</th><th>From</th><th>Cantidad</th><th>To</th><th>Cantidad</th></tr>";
            const tabla = document.getElementById("table_registros");
            for(let i=0; i<registros.length; i++) {
                const fila = document.createElement("tr");

                const celda_fecha = document.createElement("td");
                celda_fecha.innerHTML = registros[i].date;
                fila.appendChild(celda_fecha);

                const celda_time = document.createElement("td");
                celda_time.innerHTML = registros[i].time;
                fila.appendChild(celda_time);

                const celda_moneda_from = document.createElement("td");
                celda_moneda_from.innerHTML = registros[i].moneda_from;
                fila.appendChild(celda_moneda_from);

                const celda_cantidad_from = document.createElement("td");
                celda_cantidad_from.innerHTML = registros[i].cantidad_from;
                fila.appendChild(celda_cantidad_from);

                const celda_moneda_to = document.createElement("td");
                celda_moneda_to.innerHTML = registros[i].moneda_to;
                fila.appendChild(celda_moneda_to);

                const celda_cantidad_to = document.createElement("td");
                celda_cantidad_to.innerHTML = registros[i].cantidad_to;
                fila.appendChild(celda_cantidad_to);

                tabla.appendChild(fila);
            }
        } else {
            alert("Se ha producido un error al consultar sus movimientos.");
        }
    }
}

window.onload = function() {
    get_registros.open("GET", "http://127.0.0.1:5000/api/v1/movimientos", true);
    get_registros.onload = get_registros_handler;
    get_registros.onerror = function() {alert("No se ha podido completar la petición de movimientos.")};
    get_registros.send();
}