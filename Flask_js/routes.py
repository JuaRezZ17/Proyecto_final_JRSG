from Flask_js import app
from flask import render_template, jsonify, request
from Flask_js.utils.utils import VERSION
from Flask_js.models import *
import sqlite3
from http import HTTPStatus

# Ruta para cargar la página principal.
@app.route("/")
def index():
    return render_template("index.html")

# Ruta para cargar registros de la base de datos.
@app.route(f"/api/{VERSION}/movimientos")
def movimientos():
    try:
        records = get_records()
        return jsonify(
            {
                "status": "success",
                "data": records
            }
        ), HTTPStatus.OK
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST
    
# Ruta para calcular la tasa de moneda_from a moneda_to.
@app.route(f"/api/{VERSION}/tasa/<string:moneda_from>/<string:moneda_to>")
def tasa(moneda_from, moneda_to):
    rate = get_rate(moneda_from, moneda_to)

    if rate != "":
        return jsonify(
            {
                "status": "success",
                "rate": rate,
                "monedas": [moneda_from, moneda_to]
            }
        ), HTTPStatus.CREATED
    else:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST

# Ruta para insertar un registro.
@app.route(f"/api/{VERSION}/movimiento", methods=["POST"])
def movimiento():
    data = request.json

    try:
        id = post_record([data['fecha'], data['hora'], data['from_moneda'], data['from_cantidad'], data['to_moneda'], data['to_cantidad']])

        if id != -1:
            return jsonify(
                {
                    "status": "success",
                    "id": id,
                    "monedas": [data['from_moneda'], data['to_moneda']]
                }
            ), HTTPStatus.CREATED
        else:
            return jsonify(
                {
                    "status": "fail",
                    "mensaje": "Saldo insuficiente."
                }
            ), HTTPStatus.OK
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST

# Ruta para cargar el balance de la cartera.
@app.route(f"/api/{VERSION}/status")
def status():
    try:
        balance = get_status()

        return jsonify(
            {
                "status": "success",
                "data": balance
            }
        ), HTTPStatus.OK
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST