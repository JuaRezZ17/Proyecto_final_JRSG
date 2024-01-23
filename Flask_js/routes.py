from Flask_js import app
from flask import render_template, jsonify
from Flask_js.utils.utils import VERSION
from Flask_js.models import *
import sqlite3

@app.route("/")
def index():
    return render_template("index.html")

@app.route(f"/api/{VERSION}/movimientos")
def movimientos():
    try:
        registros = select_all()
        return jsonify(
            {
                "status": "success",
                "data": registros
            }
        )
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), 400

@app.route(f"/api/{VERSION}/tasa/<string:moneda_from>/<string:moneda_to>")
def intercambio(moneda_from, moneda_to):
    try:
        rate = get_tasa(moneda_from, moneda_to)
        return jsonify(
            {
                "status": "success",
                "rate": rate,
                "monedas": [moneda_from, moneda_to]
            }
        ), 201
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), 400
    
@app.route(f"/api/{VERSION}/movimiento")
def movimiento():
    pass

@app.route(f"/api/{VERSION}/status")
def estado():
    pass