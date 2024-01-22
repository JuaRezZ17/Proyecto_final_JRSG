from Flask_js import app
from flask import render_template
from config import VERSION

@app.route("/")
def index():
    return render_template("index.hmtl")

@app.route(f"/api/{VERSION}/movimientos")
def movimientos():
    pass

@app.route(f"/api/{VERSION}/<moneda_from>/<moneda_to>")
def intercambio():
    pass

@app.route(f"/api/{VERSION}/status")
def estado():
    pass