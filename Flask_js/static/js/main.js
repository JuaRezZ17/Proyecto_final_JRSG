let id = "";
let request_get_records = new XMLHttpRequest();
const VERSION = "v1";
const crypto_balance = new Map();
let request_get_status = new XMLHttpRequest();
let request_get_rate = new XMLHttpRequest();
let request_post_record = new XMLHttpRequest();

// En el "onload" están todos los métodos que se lanzan al abrir "main.html".
window.onload = function() {
    let current_url = window.location.href;
    let last_bar =  current_url.lastIndexOf("/");
    id = current_url.substring(last_bar+1, current_url.length);

    // Llamamos a la ruta "/movimientos/<string:id>" para conseguir los registros del usuario que se ha logueado.
    request_get_records.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos/" + id, true);
    request_get_records.onload = get_records_handler;
    request_get_records.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar los registros.");
    };
    request_get_records.send();

    // Llamamos a la ruta "/status/<string:id>" para conseguir el balance del usuario que se ha logueado.
    request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status/" + id, true);
    request_get_status.onload = get_status_handler;
    request_get_status.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
    };
    request_get_status.send();

    // Evento que se lanza cuando se pulsa el botón "Resumen" del menú.
    let resumen = document.getElementById("li_resumen");
    resumen.addEventListener("click", show_resumen);

    // Evento que se lanza cuando se pulsa el botón "Balance" del menú.
    let balance = document.getElementById("li_balance");
    balance.addEventListener("click", show_balance);

    // Evento que se lanza cuando se pulsa "span_update".
    let update = document.getElementById("span_update");
    update.addEventListener("click", get_status);

    // Evento que se lanza cuando queremos mostrar el formulario.
    let open = document.getElementById("button_open");
    open.addEventListener("click", show_form);

    // Eventos que se lanzan cuando se modifica el valor de "select_moneda_from", "select_moneda_to" o "input_cantidad_from".
    let select_moneda_from = document.getElementById("select_moneda_from");
    select_moneda_from.addEventListener("change", reset_values);

    let select_moneda_to = document.getElementById("select_moneda_to");
    select_moneda_to.addEventListener("change", reset_values);

    let input_cantidad_from = document.getElementById("input_cantidad_from");
    input_cantidad_from.addEventListener("change", reset_values);

    // Evento que se lanza cuando se pulsa "span_calculate".
    let calculate = document.getElementById("span_calculate");
    calculate.addEventListener("click", get_rate);

    // Evento que se lanza cuando se pulsa "button_close".
    let close = document.getElementById("button_close");
    close.addEventListener("click", close_form);

    // Evento que se lanza cuando se pulsa "button_save".
    let save = document.getElementById("button_save");
    save.addEventListener("click", post_record);

    // Evento que se lanza cuando se pulsa el botón "Cerrar sesión" del menú.
    let logout = document.getElementById("li_logout");
    logout.addEventListener("click", log_out);
}

// Función que muestra las alertas.
function show_alert(num, message) {
    if(num === 1) {
        document.getElementById("alert_success").innerText = message;
        document.getElementById("alert_success").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_success").style.display = "none";
        }, 3000);
    } else if(num === 2) {
        document.getElementById("alert_warning").innerText = message;
        document.getElementById("alert_warning").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_warning").style.display = "none";
        }, 3000);
    } else if(num === 3) {
        document.getElementById("alert_danger").innerText = message;
        document.getElementById("alert_danger").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_danger").style.display = "none";
        }, 3000);
    }
}

// Función que esconde las alertas.
function hide_alert() {
        document.getElementById("alert_success").style.display = "none";
        document.getElementById("alert_warning").style.display = "none";
        document.getElementById("alert_danger").style.display = "none";
}

// Función que muestra los registros de la base de datos en la tabla.
function get_records_handler() {
    // Comprobamos que la petición ha sido completada.
    if (this.readyState === 4) {
        // Comprobamos que el código de la petición es el correcto.
        if (this.status === 200) {
            // Vaciamos la tabla para no repetir registros al volver a cargar los datos.
            document.getElementById("table_records").innerHTML = "<tr><th>Fecha</th><th>Hora</th><th>From</th><th>Cantidad</th><th>To</th><th>Cantidad</th></tr>";

            // Guardamos los datos que nos llegan en un formato con el que podamos trabajar.
            const json_records = JSON.parse(this.responseText);
            const records = json_records.data;

            // Añadimos los nuevos datos a la tabla.
            const table_records = document.getElementById("table_records");
            if(records.length === 1) {
                const row = document.createElement("tr");
    
                const cell_vacia = document.createElement("td");
                cell_vacia.style.minWidth = "270px";
                cell_vacia.style.fontWeight = "bold";
                cell_vacia.innerText = "No hay registros en la base de datos.";
                row.appendChild(cell_vacia);

                table_records.appendChild(row);
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
                        cell_cantidad_from.innerText = Math.round(records[i].cantidad_from * 100) / 100 + " €";
                    } else {
                        cell_cantidad_from.innerText = Math.round(records[i].cantidad_from * 100000000) / 100000000;
                    }
                    row.appendChild(cell_cantidad_from);
    
                    const cell_moneda_to = document.createElement("td");
                    cell_moneda_to.innerText = records[i].moneda_to;
                    row.appendChild(cell_moneda_to);
    
                    const cell_cantidad_to = document.createElement("td");
                    if(records[i].moneda_to === "EUR") {
                        cell_cantidad_to.innerText = Math.round(records[i].cantidad_to * 100) / 100 + " €";
                    } else {
                        cell_cantidad_to.innerText = Math.round(records[i].cantidad_to * 100000000) / 100000000;
                    }
                    row.appendChild(cell_cantidad_to);
    
                    table_records.appendChild(row);
                }
            }
            
            // Guardamos el balance individual de cada crypto.
            get_crypto_balance(records);

            document.getElementById("table_cryptos").innerHTML = "<tr><th>Crypto</th><th>Cantidad</th></tr>";
            const table_cryptos = document.getElementById("table_cryptos");

            for(let item of crypto_balance) {
                const row = document.createElement("tr");

                const cell_crypto = document.createElement("td");
                cell_crypto.innerText = item[0];
                row.appendChild(cell_crypto);

                const cell_cantidad = document.createElement("td");
                cell_cantidad.innerText = Math.round(item[1] * 100000000) / 100000000;
                row.appendChild(cell_cantidad);

                table_cryptos.appendChild(row);
            }
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
    crypto_balance.set("MATIC", records[records.length-1].matic);
}

// Función que muestra el estado de la cuenta.
function get_status_handler() {
    if(this.readyState === 4) {
        if(this.status === 200) {
            const json_values = JSON.parse(this.responseText);
            const values = json_values.data;

            // Modificamos el valor de las labels para mostrar los datos por pantalla.
            status_label_color(values.invertido, "label_invested");
            document.getElementById("label_invested").innerText = Math.round(values.invertido * 100) / 100 + " €";

            status_label_color(values.recuperado, "label_recovered");
            document.getElementById("label_recovered").innerText = Math.round(values.recuperado * 100) / 100 + " €";

            status_label_color(values.valor_compra, "label_purchase_value");
            document.getElementById("label_purchase_value").innerText = Math.round(values.valor_compra * 100) / 100 + " €";

            status_label_color(values.valor_actual, "label_current_value");
            document.getElementById("label_current_value").innerText = Math.round(values.valor_actual * 100) / 100 + " €";
        } else {
            show_alert(3, "Ha ocurrido un error al cargar el balance de la cuenta.");
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

// Función que muestra "table_cryptos" cuando se hace click en la opción "Resumen" del menú.
function show_resumen(event) {
    event.preventDefault();

    document.getElementById("li_resumen").style.cursor = "default";
    document.getElementById("li_resumen").style.pointerEvents = "none";
    document.getElementById("li_balance").style.cursor = "pointer";
    document.getElementById("li_balance").style.pointerEvents = "all";

    document.getElementById("div_balance").style.display = "none";
    document.getElementById("div_resumen").style.display = "block";
}

// Función que muestra "div_balance" cuando se hace click en la opción "Balance" del menú.
function show_balance(event) {
    event.preventDefault();

    document.getElementById("li_balance").style.cursor = "default";
    document.getElementById("li_balance").style.pointerEvents = "none";
    document.getElementById("li_resumen").style.cursor = "pointer";
    document.getElementById("li_resumen").style.pointerEvents = "all";

    document.getElementById("div_resumen").style.display = "none";
    document.getElementById("div_balance").style.display = "block";
}

// Función que actualiza el estado de la cuenta.
function get_status(event) {
    event.preventDefault();

    request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status/" + id, true);
    request_get_status.onload = get_status_handler;
    request_get_status.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
    };
    request_get_status.send();
}

// Función que muestra el formulario para insertar registro.
function show_form(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("button_open").style.display = "none";
    document.getElementById("form").style.display = "inline-block";
}

// Función que se lanza cuando hay que resetear el valor de "label_cantidad_to" y "label_pu".
function reset_values(event) {
    event.preventDefault();

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

    // Llamamos a la ruta "/tasa/<string:moneda_from>/<string:moneda_to>" para conseguir el cambio de una moneda a otra.
    request_get_rate.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/tasa/" + moneda_from + "/" + moneda_to, true);
    request_get_rate.onload = get_rate_handler;
    request_get_rate.onerror = function() {
        show_alert(3, "Ha ocurrido un error al hacer la conversión.");
    };
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
        show_alert(2, "Las monedas \"From:\" y \"To:\" deben ser diferentes.");
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

// Función que esconde el formulario.
function close_form(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("form").style.display = "none";
    document.getElementById("button_open").style.display = "inline-block";

    // Reseteamos los valores del formulario.
    document.getElementById("select_moneda_from").value = "-1";
    document.getElementById("select_moneda_to").value = "-1";
    document.getElementById("input_cantidad_from").value = "";
    document.getElementById("label_cantidad_to").innerText = "";
    document.getElementById("label_pu").innerText = "";  
}

// Función que se lanza para insertar un registro.
function post_record(event) {
    event.preventDefault();

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
            "to_cantidad": cantidad_to,
            "user_id": id
        }
    )
    
    // Llamamos a la ruta "/movimientos/<string:id>" para guardar el registro.
    request_post_record.open("POST", "http://127.0.0.1:5000/api/" + VERSION + "/movimiento/" + id, true);
    request_post_record.onload = post_record_handler;
    request_post_record.onerror = function() {
        show_alert(3, "Ha ocurrido un error al guardar el registro.");
    };
    // Establecemos los valores del encabezado de la solicitud HTTP.
    request_post_record.setRequestHeader("Content-Type","application/json");
    request_post_record.send(json_records);
}

// Función que recarga los valores de la página cuando se guarda el registro.
function post_record_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const json_response = JSON.parse(this.responseText);
            show_alert(1, "El registro se ha guardado correctamente. ID: " + json_response["id"]);

            // Recargamos los registros de la tabla.
            request_get_records.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos/" + id, true);
            request_get_records.onload = get_records_handler;
            request_get_records.onerror = function() {
                show_alert(3, "Ha ocurrido un error al cargar los registros.");
            };
            request_get_records.send();

            // Recargamos el estado de la cuenta.
            request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status/" + id, true);
            request_get_status.onload = get_status_handler;
            request_get_status.onerror = function() {
                show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
            };
            request_get_status.send();

            // Reseteamos los campos del formulario
            document.getElementById("select_moneda_from").value = "-1";
            document.getElementById("select_moneda_to").value = "-1";
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

// Función que te lleva de vuelta al login.
function log_out(event) {
    event.preventDefault();

    window.location.href = "http://127.0.0.1:5000/login";
}