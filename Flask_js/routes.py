from Flask_js import app
from flask import redirect, render_template, jsonify, request
from Flask_js.utils.utils import VERSION
from Flask_js.models import *
from http import HTTPStatus
import sqlite3

# Ruta por defecto donde abre flask. Redirecciona a login.html.
@app.route("/")
def route_index():
    return redirect("/login")

# Ruta para abrir "login.html".
@app.route("/login")
def route_login():
    return render_template("login.html")

# Ruta que cargar los datos de todos los usuarios.
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
    
# Ruta para abrir "register.html".
@app.route("/register")
def route_register():
    return render_template("register.html")

# Ruta para guardar un usuario.
@app.route(f"/api/{VERSION}/user", methods=["POST"])
def route_user():
    data = request.json

    try:
        id = post_user([data['name'], data['surname'], data['address'], data['phone_number'], data['birthday'], data['email'], data['password']])

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
    
# Ruta para abrir "main.html".
@app.route("/main/<string:id>")
def route_main(id):
    return render_template("main.html")
    
# Ruta para cargar registros de la base de datos.
@app.route(f"/api/{VERSION}/movimientos/<string:id>")
def route_movimientos(id):
    try:
        records = get_records(id)
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
    
# Ruta para cargar el balance de la cartera.
@app.route(f"/api/{VERSION}/status/<string:id>")
def route_status(id):
    try:
        balance = get_status(id)

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
    
# Ruta para calcular la tasa de "moneda_from" a "moneda_to".
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

# Ruta para guardar un registro.
@app.route(f"/api/{VERSION}/movimiento/<string:id>", methods=["POST"])
def route_movimiento(id):
    data = request.json

    try:
        id = post_record([data['fecha'], data['hora'], data['from_moneda'], data['from_cantidad'], data['to_moneda'], data['to_cantidad'], data['user_id']], id)

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