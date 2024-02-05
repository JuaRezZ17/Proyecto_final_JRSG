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
def route_movimientos():
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
def route_tasa(moneda_from, moneda_to):
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
def route_movimiento():
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
def route_status():
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

@app.route(f"/login")
def route_login():
    return render_template("login.html")

@app.route(f"/register")
def route_register():
    return render_template("register.html")

@app.route(f"/api/{VERSION}/users")
def route_users():
    try:
        users = get_users()
        return jsonify(
            {
                "status": "success",
                "users": users
            }
        ), HTTPStatus.OK
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST
    
@app.route(f"/api/{VERSION}/user", methods=["POST"])
def route_user():
    data = request.json

    try:
        id = post_user([data['email'], data['password'], data['name'], data['surname']])

        return jsonify(
            {
                "status": "success",
                "id": id,
            }
        ), HTTPStatus.CREATED
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST