const VERSION = "v1"
let request_get_users = new XMLHttpRequest();
const users = [];

function log_in(event) {
    event.preventDefault();

    if(! check_fields()) {
        return;
    }

    document.location.href = "http://127.0.0.1:5000/index/hola";
}

// Función que comprueba que los campos contienen un dato válido.
function check_fields() {
    // Comprobar que los campos no estan vacíos.
    const name = document.getElementById("input_name").value;
    const surname = document.getElementById("input_surname").value;
    const email = document.getElementById("input_email").value;
    const passwd1 = document.getElementById("input_password_1").value;
    const passwd2 = document.getElementById("input_password_2").value;
    if(name === "" || surname === "" || email === "" || passwd1 === "" || passwd2 === "") {
        show_alert(2, "Debe rellenar todos los campos.");
        return false;
    }

    // Comprobar que no existe un usuario creado con ese email.
    for(let i=0; i<users.length; i++) {
        if(email === users[i]) {
            show_alert(2, "Ya existe un usuario con este correo.");
            return false;
        }
    }

    // Comprobar que las contraseñas no son iguales.
    if(passwd1 != passwd2) {
        show_alert(2, "Las contraseñas no coinciden.");
        return false;
    }

    return true;
}

function create_user(event) {
    event.preventDefault();
    document.location.href = "http://127.0.0.1:5000/register/";
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

// En el "onload" están todos los métodos que se lanzan al abrir la página.
window.onload = function() {
    request_get_users.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/users", true);
    request_get_users.onload = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const json_users = JSON.parse(this.responseText);
                const array_users = json_users.users;

                for(let i=0; i<array_users.length; i++) {
                    users[i] = array_users[i];
                }
            }
        }
    };
    request_get_users.onerror = function() {show_alert(3, "No se ha podido comprobar si el email ya esxiste.")};
    request_get_users.send();

    let login = document.getElementById("button_register");
    login.addEventListener("click", log_in);

    let create = document.getElementById("button_register");
    create.addEventListener("click", create_user);
}