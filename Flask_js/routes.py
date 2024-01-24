from Flask_js import app
from flask import render_template, jsonify, request
from Flask_js.utils.utils import VERSION
from Flask_js.models import *
import sqlite3

# Ruta de la página principal.
@app.route("/")
def index():
    return render_template("index.html")

# Ruta para cargar movimientos de la base de datos.
@app.route(f"/api/{VERSION}/movimientos")
def movimientos():
    try:
        movimientos = get_registros()
        return jsonify(
            {
                "status": "success",
                "data": movimientos
            }
        )
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), 400
    
# Ruta para calcular el cambio de moneda_from a moneda_to.
@app.route(f"/api/{VERSION}/tasa/<string:moneda_from>/<string:moneda_to>")
def intercambio(moneda_from, moneda_to):
    rate = get_tasa(moneda_from, moneda_to)

    if rate != "":
        return jsonify(
            {
                "status": "success",
                "rate": rate,
                "monedas": [moneda_from, moneda_to]
            }
        ), 201
    else:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), 400

# Ruta para realizar el movimiento.
@app.route(f"/api/{VERSION}/movimiento", methods=["POST"])
def movimiento():
    data = request.json

    try:
        id = post_record([data['fecha'], data['hora'], data['from_moneda'], data['from_cantidad'], data['to_moneda'], data['to_cantidad']])

        if id == -1:
            return jsonify(
                {
                    "status": "fail",
                    "mensaje": "Saldo insuficiente."
                }
            ), 200
        else:
            return jsonify(
                {
                    "status": "success",
                    "id": id,
                    "monedas": [data['from_moneda'], data['to_moneda']]
                }
            ), 201
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), 400

# Ruta para realizar el estado de la cartera.
@app.route(f"/api/{VERSION}/status")
def estado():
    pass