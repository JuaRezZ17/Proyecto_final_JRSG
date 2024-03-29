let request_get_emails = new XMLHttpRequest();
const VERSION = "v1"
const users = [];
let request_post_user = new XMLHttpRequest();

// En el "onload" están todos los métodos que se lanzan al abrir "register.html".
window.onload = function() {
    // Llamamos a la ruta "/users" para conseguir los datos de los emails existentes.
    request_get_emails.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/users", true);
    request_get_emails.onload = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const json_users = JSON.parse(this.responseText);
                const array_users = json_users.users;

                for(let i=0; i<array_users.length; i++) {
                    // Guardamos los correos en un array.
                    users[i] = array_users[i][1];
                }
            }
        }
    };
    request_get_emails.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar los usuarios.")
    };
    request_get_emails.send();

    // Eventos que se lanzan cuando se modifica el valor de "input_email" o "input_password".
    let name = document.getElementById("input_name");
    name.addEventListener("change", hide_alert);

    let surname = document.getElementById("input_surname");
    surname.addEventListener("change", hide_alert);

    let address = document.getElementById("input_address");
    address.addEventListener("change", hide_alert);

    let phone = document.getElementById("input_phone");
    phone.addEventListener("change", hide_alert);

    let birthday = document.getElementById("input_birthday");
    birthday.addEventListener("change", hide_alert);

    let email = document.getElementById("input_email");
    email.addEventListener("change", hide_alert);

    let passwd1 = document.getElementById("input_password_1");
    passwd1.addEventListener("change", hide_alert);

    let passwd2 = document.getElementById("input_password_2");
    passwd2.addEventListener("change", hide_alert);

    // Evento que se lanza cuando se hace click en el botón "Registrar".
    let register = document.getElementById("button_register");
    register.addEventListener("click", post_user);
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

// Función que se lanza cuando se hace click en el botón "Registrar".
function post_user(event) {
    event.preventDefault();

    // Comprobamos que todos los valores son correctos.
    if(! check_fields()) {
        return;
    }

    const name = document.getElementById("input_name").value;
    const surname = document.getElementById("input_surname").value;
    const address = document.getElementById("input_address").value;
    const phone = document.getElementById("input_phone").value;
    const birthday = document.getElementById("input_birthday").value;
    const email = document.getElementById("input_email").value;
    const passwd = document.getElementById("input_password_1").value;

    const json_user = JSON.stringify(
        {
            "name": name,
            "surname": surname,
            "address": address,
            "phone_number": phone,
            "birthday": birthday,
            "email": email,
            "password": passwd,
        }
    )

    // Realizamos la petición "POST".
    request_post_user.open("POST", "http://127.0.0.1:5000/api/" + VERSION + "/user", true);
    request_post_user.onload = post_user_handler;
    request_post_user.onerror = function() {
        show_alert(3, "Ha ocurrido un error al crear el usuario.")
    };
    // Establecemos los valores del encabezado de la solicitud HTTP.
    request_post_user.setRequestHeader("Content-Type","application/json");
    request_post_user.send(json_user);
}

// Función que comprueba que los campos contienen un dato válido.
function check_fields() {
    const name = document.getElementById("input_name").value;
    const surname = document.getElementById("input_surname").value;
    const address = document.getElementById("input_address").value;
    const phone = document.getElementById("input_phone").value;
    const birthday = document.getElementById("input_birthday").value;
    const email = document.getElementById("input_email").value;
    const passwd1 = document.getElementById("input_password_1").value;
    const passwd2 = document.getElementById("input_password_2").value;
    // Comprobar que los campos no estan vacíos.
    if(name === "" || surname === "" || address === "" || phone === "" || birthday === "" || email === "" || passwd1 === "" || passwd2 === "") {
        show_alert(2, "Debe rellenar todos los campos.");
        return false;
    }

    // Comprobar que el usuario es mayor de edad.
    if(! validate_age(birthday)) {
        show_alert(3, "Debes ser mayor de edad.");
        return false;
    }

    // Comprobar que no existe un usuario ya creado con ese email.
    for(let i=0; i<users.length; i++) {
        if(email === users[i]) {
            show_alert(2, "Ya existe un usuario con este correo.");
            return false;
        }
    }

    // Comprobar que las contraseñas son iguales.
    if(passwd1 != passwd2) {
        show_alert(2, "Las contraseñas no coinciden.");
        return false;
    }

    return true;
}

// Función que devuelve si eres mayor de edad o no.
function validate_age(birthday) {
    birthday = birthday.replace(/-/g, "/");

    let my_birthday = new Date(birthday);
    let current_date = new Date().toJSON().slice(0, 10);

    let my_age = ~~((Date.now(current_date) - my_birthday) / (31557600000));

    if(my_age < 18) {
        return false;
    } else {
        return true;
    }
}

// Función que se utiliza cuando se crea un usuario.
function post_user_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const json_response = JSON.parse(this.responseText);
            show_alert(1, "El usuario se ha creado correctamente. ID: " + json_response["id"]);
            setTimeout(function() {
                window.location.href = "http://127.0.0.1:5000/login";
            }, 3000);
        } else {
            show_alert(3, "Ha ocurrido un error al crear el usuario.");
        }
    }
}