# Proyecto final de Bootcamp Aprender a programar desde cero.

### Hecho por Juan Rafael Sánchez García.

Programa hecho en Python con el framework Flask y SQLite como base de datos. Además de HTML, CSS y JavaScript para el diseño web.

## Instalación.
* Los elementos entre comillas dobles simbolizan un nombre a su elección.

- Crear entorno en python:
```python -m venv "Nombre del entorno"```
- Activar el entorno:
```.\"Nombre del entorno"\Scripts\activate```
- Instalar los requerimientos del proyecto:
```pip install -r .\requeriments.txt```

## Ejecución del servidor.

Nos hubicamos en la carpeta del proyecto donde se encuentra el fichero 'main.py'. Y a partir de aquí:

- La aplicación provee de una base de datos (movimientos.sqlite) en la carpeta data por si desea utilizarla. En caso de que quiera utilizar su base de datos, también en la carpeta data, se encuentra el fichero 'create.sql' con las querys para crear las tablas necesarias.

- Renombrar el fichero 'config_template.py' a 'config.py' y agregar la dirección donde esta la base de datos que vaya a utilizar. 

Hay dos formas de ejecutar el proyecto:

- Las más sencilla es ubicarnos en la carpeta donde esta el fichero 'main.py' y utilizar el comando:
```flask run```

- La otra forma sería:
    - Iniciar el servidor de flask:
        - En Windows: set FLASK_APP=main.py
        - En Mac: export FLASK_APP=main.py

    - Ejecutar el servidor:
        - flask --app main run

    - Para ejecutar el servidor en un puerto diferente al 5000 (puerto por defecto de flask):
        - flask --app main run -p "Puerto deseado"

    - Para ejecutar en modo debug:
        - flask --app main --debug run

## Utilización del programa.
El programa consiste en una aplicación web de cryptomonedas donde podrá comprar, tradear y vender criptomonedas y tener guardados todos sus movimientos.

La aplicación se inicia en la pantalla de "Login" donde tendrá que introducir sus credenciales para acceder a su cuenta. Si no posee una cuenta debe acceder a la opción "Crear usuario" en esa misma ventana.

En la pantalla de "Registro" debe rellenar todos los campos. Recuerde que:

    - Debe ser mayor de edad para utilizar esta aplicación.

    - El correo que utilice no debe estar ligado a una cuenta ya existente.

    - Las contraseñas que introduzca deben ser iguales para poder crear el usuario.

Una vez creado el usuario se le devolverá a la pantalla de "Login" donde debe introducir el correo y contraseña que utilizó al crear el usuario para acceder a su cuenta.

Si las credenciales son correctas accederá a la pantalla principal de su cuenta. Aquí podrá ver todos los movimientos que ha realizado, el balance de su cuenta y la cantidad de cada crypto que posee.

Si quiere realizar un nuevo movimiento debe hacer click en el botón "+" debajo de la tabla y rellenar los campos. Recuerde que:

    - Las monedas "From" y "To" deben ser diferentes.

    - Debe calcular el cambio de moneda "From" a moneda "To" antes de guardar el registro.

    - Debe tener moneda "From" suficiente para realizar la operación.