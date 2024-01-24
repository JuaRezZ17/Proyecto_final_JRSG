from flask import Flask
from flask_cors import CORS

app = Flask(__name__, instance_relative_config=True)
app.config.from_object("config")

CORS(app)

from Flask_js.routes import *