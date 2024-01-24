const VERSION = "v1"
let request_get_registros = new XMLHttpRequest();
let request_get_tasa = new XMLHttpRequest();
let request_post_registro = new XMLHttpRequest();

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

function get_tasa(event) {
    event.preventDefault();

    if(! check_fields()) {
        return;
    }

    const moneda_from = document.getElementById("select_moneda_from").value;
    const moneda_to = document.getElementById("select_moneda_to").value;

    request_get_tasa.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/tasa/" + moneda_from + "/" + moneda_to, true);
    request_get_tasa.onload = get_tasa_handler;
    request_get_tasa.onerror = function() {alert("No se ha podido completar la petición de tasa.")};
    request_get_tasa.send();
}

function check_fields(bool=false) {
    const moneda_from = document.getElementById("select_moneda_from").value;
    if(moneda_from === "") {
        alert("Debe seleccionar una moneda en \"From:\".");
        return false;
    }

    const moneda_to = document.getElementById("select_moneda_to").value;
    if(moneda_to === "") {
        alert("Debe seleccionar una moneda en \"To:\".");
        return false;
    }

    if(moneda_from === moneda_to) {
        alert("Las monedas \"From:\" y \"To:\" deben ser diferentes.");
        return false;
    }

    const quantity_from = document.getElementById("input_quantity_from").value;
    if(quantity_from === "") {
        alert("Debe introducir una cantidad.");
        return false;
    }

    if(bool) {
        const quantity_to = document.getElementById("label_quantity_to").innerText;
        const pu = document.getElementById("label_pu").innerText;
        if(quantity_to === "" || pu === "") {
            alert("Debe calcular el cambio de las monedas.");
            return false;
        }
    }

    return true;
}

function get_tasa_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const response_json = JSON.parse(this.responseText);

            document.getElementById("label_quantity_to").innerText = response_json["rate"] * document.getElementById("input_quantity_from").value;
            document.getElementById("label_pu").innerText = response_json["rate"];
        } else {
            alert("Se ha producido un error al consultar sus movimientos.");
        }
    }
}

function post_alta_registro(event) {
    event.preventDefault();

    if(! check_fields(true)) {
        return;
    }

    const fecha = new Date().toLocaleDateString("fr-CA");
    const hora = new Date().toLocaleTimeString("es-ES");
    const moneda_from = document.getElementById("select_moneda_from").value;
    const cantidad_from = document.getElementById("input_quantity_from").value;
    const moneda_to = document.getElementById("select_moneda_to").value;
    const cantidad_to = document.getElementById("label_quantity_to").innerText;

    const registro_json = JSON.stringify(
        {
            "fecha": fecha,
            "hora": hora,
            "from_moneda": moneda_from,
            "from_cantidad": cantidad_from,
            "to_moneda": moneda_to,
            "to_cantidad": cantidad_to
        }
    )
    
    request_post_registro.open("POST", "http://127.0.0.1:5000/api/" + VERSION + "/movimiento", true);
    request_post_registro.onload = post_alta_registro_handler;
    request_post_registro.onerror = function() {alert("No se ha podido realizar el registro.")};
    request_post_registro.setRequestHeader("Content-Type","application/json");
    request_post_registro.send(registro_json);
}
// TODO: Hace el insert pero copia lo que ya existe en la base de datos 
function post_alta_registro_handler() {
    if(this.readyState === 4) {
        alert(this.status)
        if(this.status === 201) {
            alert("3")
            const response_json = JSON.parse(this.responseText);
            alert("El registro se ha insertado correctamente. ID: " + response_json["id"]);

            request_get_registros.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos", true);
            request_get_registros.onload = get_registros_handler;
            request_get_registros.onerror = function() {alert("No se ha podido completar la petición de movimientos.")};
            request_get_registros.send();

            document.getElementById("select_moneda_from").value = -1;
            document.getElementById("select_moneda_to").value = -1;
            document.getElementById("input_quantity_from").value = "";
            document.getElementById("label_quantity_to").innerText = "";
            document.getElementById("label_pu").innerText = "";            
        }
    }
}

window.onload = function() {
    request_get_registros.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos", true);
    request_get_registros.onload = get_registros_handler;
    request_get_registros.onerror = function() {alert("No se ha podido completar la petición de movimientos.")};
    request_get_registros.send();

    let calcular = document.getElementById("btn_calcular");
    calcular.addEventListener("click", get_tasa);

    let guardar = document.getElementById("btn_guardar");
    guardar.addEventListener("click", post_alta_registro)
}