from Flask_js import app
from flask import render_template, jsonify
from config import VERSION
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
        )

@app.route(f"/api/{VERSION}/<moneda_from>/<moneda_to>")
def intercambio():
    pass

@app.route(f"/api/{VERSION}/status")
def estado():
    pass