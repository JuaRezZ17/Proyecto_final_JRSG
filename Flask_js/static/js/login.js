const VERSION = "v1";
const first_login = false;
let request_get_users = new XMLHttpRequest();
const users = [];
let request_go_to_main = new XMLHttpRequest();

function log_in(event) {
    event.preventDefault();

    const check_fields_result = check_fields()

    if(check_fields_result === "email") {
        show_alert("No existe ningún usuario con ese correo.");
        return;
    } else if(check_fields_result === "password") {
        show_alert("La contraseña no es correcta.");
        return;
    } else {
        window.location.href = "http://127.0.0.1:5000/main/" + check_fields_result;
    }
}

// Función que comprueba que los campos contienen un dato válido.
function check_fields() {
    const user = document.getElementById("input_login_email").value;
    const password = document.getElementById("input_login_password").value;

    // Comprobar que existe un usuario con ese correo.
    for(let i=0; i<users.length; i++) {
        if(user === users[i][1]) {
            if(password === users[i][2]) {
                return users[i][0];
            } else {
                return "password";
            }
        }
    }

    return "email";
}

function create_user(event) {
    event.preventDefault();

    document.location.href = "http://127.0.0.1:5000/register";
}

// Función que muestra las alertas.
function show_alert(message) {
    document.getElementById("alert_warning").innerText = message;
    document.getElementById("alert_warning").style.display = "inline-block";
    setTimeout(function() {
        document.getElementById("alert_warning").style.display = "none";
    }, 3000)
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
    request_get_users.onerror = function() {};
    request_get_users.send();

    let login = document.getElementById("button_login");
    login.addEventListener("click", log_in);

    let create = document.getElementById("button_register");
    create.addEventListener("click", create_user);
}