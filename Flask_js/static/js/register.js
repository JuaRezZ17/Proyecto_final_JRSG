const VERSION = "v1"
let request_get_emails = new XMLHttpRequest();
const users = [];
let request_post_user = new XMLHttpRequest();

function post_user(event) {
    event.preventDefault();

    if(! check_fields()) {
        return;
    }

    const name = document.getElementById("input_name").value;
    const surname = document.getElementById("input_surname").value;
    const email = document.getElementById("input_email").value;
    const passwd = document.getElementById("input_password_1").value;

    const json_user = JSON.stringify(
        {
            "email": email,
            "password": passwd,
            "name": name,
            "surname": surname,
        }
    )

    // Realizamos la petición "POST".
    request_post_user.open("POST", "http://127.0.0.1:5000/api/" + VERSION + "/user", true);
    request_post_user.onload = post_user_handler;
    request_post_user.onerror = function() {show_alert(3, "Ha ocurrido un error al insertar el registro.")};
    // Establecemos los valores del encabezado de la solicitud HTTP.
    request_post_user.setRequestHeader("Content-Type","application/json");
    request_post_user.send(json_user);
}

function post_user_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const json_response = JSON.parse(this.responseText);
            show_alert(1, "El usuario se ha creado correctamente. ID: " + json_response["id"]);

            document.location.href = "http://127.0.0.1:5000/login";
        } else {
            show_alert(3, "Ha ocurrido un error al crear el usuario.");
        }
    }
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
    request_get_emails.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/users", true);
    request_get_emails.onload = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const json_users = JSON.parse(this.responseText);
                const array_users = json_users.users;

                for(let i=0; i<array_users.length; i++) {
                    users[i] = array_users[i][0];
                }
            }
        }
    };
    request_get_emails.onerror = function() {show_alert(3, "No se ha podido comprobar si el email ya esxiste.")};
    request_get_emails.send();

    let register = document.getElementById("button_register");
    register.addEventListener("click", post_user);
}