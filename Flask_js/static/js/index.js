const VERSION = "v1"
let request_get_records = new XMLHttpRequest();
const crypto_balance = new Map();
let request_get_status = new XMLHttpRequest();
let request_get_rate = new XMLHttpRequest();
let request_post_record = new XMLHttpRequest();

// Función que muestra los registros de la base de datos en la tabla.
function get_records_handler() {
    // Comprobamos que la petición ha sido completada.
    if (this.readyState === 4) {
        // Comprobamos que el código de la petición es el correcto.
        if (this.status === 200) {
            // Vaciamos la tabla para no repetir registros al insertar.
            document.getElementById("table_records").innerHTML = "<tr><th>Fecha</th><th>Hora</th><th>From</th><th>Cantidad</th><th>To</th><th>Cantidad</th></tr>";

            // Guardamos los datos que nos llegan en un formato con el que podamos trabajar.
            const json_records = JSON.parse(this.responseText);
            const records = json_records.data;

            // Añadimos los nuevos datos a la tabla.
            const table = document.getElementById("table_records");
            if(records.length === 1) {
                const row = document.createElement("tr");
    
                const cell_vacia = document.createElement("td");
                cell_vacia.style.minWidth = "270px";
                cell_vacia.style.fontWeight = "bold";
                cell_vacia.innerText = "No hay registros en la base de datos.";
                row.appendChild(cell_vacia);

                table.appendChild(row);
            } else {
                for(let i=0; i<records.length-1; i++) {
                    const row = document.createElement("tr");
    
                    const cell_date = document.createElement("td");
                    cell_date.innerText = records[i].date;
                    row.appendChild(cell_date);
    
                    const cell_time = document.createElement("td");
                    cell_time.innerText = records[i].time;
                    row.appendChild(cell_time);
    
                    const cell_moneda_from = document.createElement("td");
                    cell_moneda_from.innerText = records[i].moneda_from;
                    row.appendChild(cell_moneda_from);
    
                    const cell_cantidad_from = document.createElement("td");
                    if(records[i].moneda_from === "EUR") {
                        cell_cantidad_from.innerText = records[i].cantidad_from.toFixed(2);
                    } else {
                        cell_cantidad_from.innerText = records[i].cantidad_from.toFixed(8);
                    }
                    row.appendChild(cell_cantidad_from);
    
                    const cell_moneda_to = document.createElement("td");
                    cell_moneda_to.innerText = records[i].moneda_to;
                    row.appendChild(cell_moneda_to);
    
                    const cell_cantidad_to = document.createElement("td");
                    if(records[i].cantidad_to === "EUR") {
                        cell_cantidad_to.innerText = records[i].cantidad_to.toFixed(2);
                    } else {
                        cell_cantidad_to.innerText = records[i].cantidad_to.toFixed(8);
                    }
                    row.appendChild(cell_cantidad_to);
    
                    table.appendChild(row);
                }
            }
            
            // Guardamos el balance individual de cada crypto.
            get_crypto_balance(records);
        } else {
            show_alert(3, "Ha ocurrido un error al cargar los registros.");
        }
    }
}

// Función que guarda el balance individual de cada crypto.
function get_crypto_balance(records) {
    crypto_balance.clear();
    crypto_balance.set("BTC", records[records.length-1].btc);
    crypto_balance.set("ETH", records[records.length-1].eth);
    crypto_balance.set("USDT", records[records.length-1].usdt);
    crypto_balance.set("BNB", records[records.length-1].bnb);
    crypto_balance.set("XRP", records[records.length-1].xrp);
    crypto_balance.set("ADA", records[records.length-1].ada);
    crypto_balance.set("SOL", records[records.length-1].sol);
    crypto_balance.set("DOT", records[records.length-1].dot);
    crypto_balance.set("MATIC", records[registros.length-1].matic);
}

// Función que muestra el estado de la cuenta.
function get_status_handler() {
    if(this.readyState === 4) {
        if(this.status === 200) {
            const json_values = JSON.parse(this.responseText);
            const values = json_values.data;

            // Modificamos el valor de las labels para mostrar los datos por pantalla.
            status_label_color(values.invertido, "label_invested")
            document.getElementById("label_invested").innerText = values.invertido.toFixed(2) + " €";

            status_label_color(values.recuperado, "label_recovered")
            document.getElementById("label_recovered").innerText = values.recuperado.toFixed(2) + " €";

            status_label_color(values.valor_compra, "label_purchase_value")
            document.getElementById("label_purchase_value").innerText = values.valor_compra.toFixed(2) + " €";

            status_label_color(values.valor_actual, "label_current_value")
            document.getElementById("label_current_value").innerText = values.valor_actual.toFixed(2) + " €";
        } else {
            show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
        }
    }
}

// Función que cambia el color de las labels de balance de cuenta.
function status_label_color(valor, label) {
    if(valor < 0) {
        document.getElementById(label).style.color = "red";
    } else {
        document.getElementById(label).style.color = "black";
    }
}

// Función que se lanza cuando actualizamos el estado de la cuenta.
function get_status(event) {
    event.preventDefault();
    hide_alert();

    request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status", true);
    request_get_status.onload = get_status_handler;
    request_get_status.onerror = function() {show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.")};
    request_get_status.send();
}

// Función que se lanza cuando queremos mostrar el formulario.
function show_form(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("form").style.display = "inline-block";
}

// Función que se lanza cuando hay que resetear el valor de "label_cantidad_to" y "label_pu".
function reset_values(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("label_cantidad_to").innerText = "";
    document.getElementById("label_pu").innerText = "";
}

// Función que se lanza para conseguir la tasa de intercambio entre dos monedas.
function get_rate(event) {
    event.preventDefault();
    hide_alert();

    const moneda_from = document.getElementById("select_moneda_from").value;
    const cantidad_from = document.getElementById("input_cantidad_from").value;

    // Comprobamos que todos los campos están rellenados correctamente y que hay balance suficiente de "moneda_from".
    if(! check_all(false, moneda_from, cantidad_from)) {
        return;
    }
    
    const moneda_to = document.getElementById("select_moneda_to").value;

    // Realizamos la petición "GET".
    request_get_rate.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/tasa/" + moneda_from + "/" + moneda_to, true);
    request_get_rate.onload = get_rate_handler;
    request_get_rate.onerror = function() {show_alert(3, "Ha ocurrido un error al hacer la conversión.")};
    request_get_rate.send();
}

// Función que comprueba que todos los campos están rellenados correctamente y que hay balance suficiente de "moneda_from".
function check_all(bool, moneda_from, cantidad_from) {
    if(check_fields(bool) && check_balance(moneda_from, cantidad_from)) {
        return true;
    }

    return false;
}

// Función que comprueba que los campos contienen un dato válido.
function check_fields(bool) {
    const moneda_from = document.getElementById("select_moneda_from").value;
    if(moneda_from === "") {
        show_alert(2, "Debe seleccionar una moneda en \"From:\".");
        return false;
    }

    const moneda_to = document.getElementById("select_moneda_to").value;
    if(moneda_to === "") {
        show_alert(2, "Debe seleccionar una moneda en \"To:\".");
        return false;
    }

    if(moneda_from === moneda_to) {
        show_alert(2, "Las monedas \"From:\" y \"To:\" deben ser diferentes.")
        return false;
    }

    const cantidad_from = document.getElementById("input_cantidad_from").value;
    if(cantidad_from === "" || cantidad_from <= 0) {
        show_alert(2, "Debe introducir una cantidad.");
        return false;
    }

    if(bool) {
        const cantidad_to = document.getElementById("label_cantidad_to").innerText;
        const pu = document.getElementById("label_pu").innerText;

        if(cantidad_to === "" || pu === "") {
            show_alert(2, "Debe calcular el cambio de las monedas antes de realizar el registro.");
            return false;
        }
    }

    return true;
}

// Función que comprueba que hay balance suficiente de una moneda.
function check_balance(moneda_from, cantidad_from) {
    if(cantidad_from > crypto_balance.get(moneda_from)) {
        show_alert(2, "No tiene " + moneda_from + " suficiente para realizar esta operación.");
        return false;
    }

    return true;
}

// Función que muestra el cambio de una moneda a otra.
function get_rate_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const json_reponse = JSON.parse(this.responseText);


            document.getElementById("label_cantidad_to").innerText = json_reponse["rate"] * document.getElementById("input_cantidad_from").value;
            document.getElementById("label_pu").innerText = json_reponse["rate"];
        } else {
            show_alert(3, "Ha ocurrido un error al hacer la conversión.");
        }
    }
}

// Función que se lanza cuando queremos cerrar el formulario.
function close_form(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("form").style.display = "none";

    // Reseteamos los valores del formulario.
    document.getElementById("select_moneda_from").value = -1;
    document.getElementById("select_moneda_to").value = -1;
    document.getElementById("input_cantidad_from").value = "";
    document.getElementById("label_cantidad_to").innerText = "";
    document.getElementById("label_pu").innerText = "";  
}

// Función que se lanza para insertar un registro.
function post_record(event) {
    event.preventDefault();
    hide_alert();

    const cantidad_from = document.getElementById("input_cantidad_from").value;
    const moneda_from = document.getElementById("select_moneda_from").value;

    if(! check_all(true, moneda_from, cantidad_from)) {
        return;
    }

    const date = new Date().toLocaleDateString("fr-CA");
    const time = new Date().toLocaleTimeString("es-ES");
    const moneda_to = document.getElementById("select_moneda_to").value;
    const cantidad_to = document.getElementById("label_cantidad_to").innerText;

    // Guardamos los datos de los campos en un JSON.
    const json_records = JSON.stringify(
        {
            "fecha": date,
            "hora": time,
            "from_moneda": moneda_from,
            "from_cantidad": cantidad_from,
            "to_moneda": moneda_to,
            "to_cantidad": cantidad_to
        }
    )
    
    // Realizamos la petición "POST".
    request_post_record.open("POST", "http://127.0.0.1:5000/api/" + VERSION + "/movimiento", true);
    request_post_record.onload = post_record_handler;
    request_post_record.onerror = function() {show_alert(3, "Ha ocurrido un error al insertar el registro.")};
    // Establecemos los valores del encabezado de la solicitud HTTP.
    request_post_record.setRequestHeader("Content-Type","application/json");
    request_post_record.send(json_records);
}

// Función que muestra los valores
function post_record_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const json_response = JSON.parse(this.responseText);
            show_alert(1, "El registro se ha guardado correctamente. ID: " + json_response["id"]);

            // Actualizo los registros de la tabla.
            request_get_records.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos", true);
            request_get_records.onload = get_records_handler;
            request_get_records.onerror = function() {show_alert(3, "No se han podido cargar los registros.")};
            request_get_records.send();

            // Actualizo el estado de la cuenta.
            // request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status", true);
            // request_get_status.onload = get_status_handler;
            // request_get_status.onerror = function() {alert("Ha ocurrido un error al cargar el estado de la cuenta.")};
            // request_get_status.send();

            document.getElementById("select_moneda_from").value = -1;
            document.getElementById("select_moneda_to").value = -1;
            document.getElementById("input_cantidad_from").value = "";
            document.getElementById("label_cantidad_to").innerText = "";
            document.getElementById("label_pu").innerText = "";            
        } else if(this.status === 200) {
            const moneda_from = document.getElementById("select_moneda_from").value;
            show_alert(2, "No tiene " + moneda_from + " suficiente para realizar esta operación.");
        } else {
            show_alert(3, "Ha ocurrido un error al insertar el registro.");
        }
    }
}

// Función que muestra las alertas.
function show_alert(num, message) {
    if(num === 1) {
        document.getElementById("alert_success").innerText = message;
        document.getElementById("alert_success").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_success").style.display = "none";
        }, 3000)
    } else if(num === 2) {
        document.getElementById("alert_warning").innerText = message;
        document.getElementById("alert_warning").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_warning").style.display = "none";
        }, 3000)
    } else if(num === 3) {
        document.getElementById("alert_danger").innerText = message;
        document.getElementById("alert_danger").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_danger").style.display = "none";
        }, 3000)
    }
}

// Función que esconde las alertas.
function hide_alert() {
        document.getElementById("alert_success").style.display = "none";
        document.getElementById("alert_warning").style.display = "none";
        document.getElementById("alert_danger").style.display = "none";
}

// En el "onload" están todos los métodos que se lanzan al abrir la página.
window.onload = function() {
    // Lanzamos la petición para obtener los registros.
    request_get_records.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos", true);
    request_get_records.onload = get_records_handler;
    request_get_records.onerror = function() {show_alert(3, "Ha ocurrido un error al cargar los registros.")};
    request_get_records.send();

    // Lanzamos la petición para obtener el estado de la cuenta.
    // request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status", true);
    // request_get_status.onload = get_status_handler;
    // request_get_status.onerror = function() {alert("Ha ocurrido un error al cargar el estado de la cuenta.")};
    // request_get_status.send();

    // Evento que se lanza cuando queremos actualizar el estado de la cuenta.
    let update = document.getElementById("span_update");
    update.addEventListener("click", get_status);

    // Evento que se lanza cuando queremos mostrar el formulario.
    let open = document.getElementById("button_open");
    open.addEventListener("click", show_form);

    // Eventos que se lanzan cuando se modifica el valor de moneda_from, moneda_to o cantidad_from.
    let select_moneda_from = document.getElementById("select_moneda_from");
    select_moneda_from.addEventListener("change", reset_values);

    let select_moneda_to = document.getElementById("select_moneda_to");
    select_moneda_to.addEventListener("change", reset_values);

    let input_cantidad_from = document.getElementById("input_cantidad_from");
    input_cantidad_from.addEventListener("change", reset_values);

    // Evento que se lanza cuando queremos saber el cambio de moneda_from a moneda_to.
    let calculate = document.getElementById("span_calculate");
    calculate.addEventListener("click", get_rate);

    // Evento que se lanza cuando queremos cerrar el formulario.
    let close = document.getElementById("button_close");
    close.addEventListener("click", close_form);

    // Evento que se lanza cuando queremos guardar un registro.
    let save = document.getElementById("button_save");
    save.addEventListener("click", post_record);
}