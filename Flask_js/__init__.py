from flask import Flask
from flask_cors import CORS

# Creamos la app y modificamos el comportamiento de la rutas relativas.
app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")

# Utilizamos CORS para evitar posibles errores en las peticiones HTTP.
CORS(app)

from Flask_js.routes import *