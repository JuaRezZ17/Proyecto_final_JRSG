let request_get_users = new XMLHttpRequest();
const VERSION = "v1";
const users = [];

// En el "onload" están todos los métodos que se lanzan al abrir "login.html".
window.onload = function() {
    // Llamamos a la ruta "/users" para conseguir los datos de los usuarios existentes.
    request_get_users.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/users", true);
    request_get_users.onload = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const json_users = JSON.parse(this.responseText);
                const array_users = json_users.users;

                for(let i=0; i<array_users.length; i++) {
                    // Guardamos los datos en un array.
                    users[i] = array_users[i];
                }
            }
        }
    };
    request_get_users.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar los usuarios.")
    };
    request_get_users.send();
    
    // Evento que se lanza cuando se hace click en el botón "Entrar".
    let login = document.getElementById("button_login");
    login.addEventListener("click", log_in);
    
    // Eventos que se lanzan cuando se modifica el valor de "input_email" o "input_password".
    let email = document.getElementById("input_email");
    email.addEventListener("change", hide_alert);

    let password = document.getElementById("input_password");
    password.addEventListener("change", hide_alert);

    // Evento que se lanza cuando se hace click en el botón "Crear usuario".
    let register = document.getElementById("button_register");
    register.addEventListener("click", register_user);
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

// Función que se lanza cuando se hace click en el botón "Entrar".
function log_in(event) {
    event.preventDefault();

    // Comprobamos que existe un usuario con ese correo y contraseña.
    const check_fields_result = check_fields()

    if(check_fields_result === "email") {
        show_alert(2, "No existe ningún usuario con ese correo.");
        return;
    } else if(check_fields_result === "password") {
        show_alert(2, "La contraseña no es correcta.");
        return;
    } else {
        window.location.href = "http://127.0.0.1:5000/main/" + check_fields_result;
    }
}

// Función que comprueba que existe un usuario con ese correo y contraseña.
function check_fields() {
    const user = document.getElementById("input_email").value;
    const password = document.getElementById("input_password").value;

    for(let i=0; i<users.length; i++) {
        // Comprobamos que existe un usuario con ese correo.
        if(user === users[i][1]) {
            // Comprobamos que la contraseña de ese usuario es correcta.
            if(password === users[i][2]) {
                return users[i][0];
            } else {
                return "password";
            }
        }
    }

    return "email";
}

// Función que se lanza cuando se hace click en el botón "Crear usuario".
function register_user(event) {
    event.preventDefault();

    window.location.href = "http://127.0.0.1:5000/register";
}