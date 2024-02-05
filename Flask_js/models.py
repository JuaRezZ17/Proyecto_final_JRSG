from Flask_js.conexion import Conexion
import requests
from Flask_js.utils.utils import API, API_KEY, cryptos
from Flask_js.utils.functions import crypto_quantity, all_cryptos_balance

# Función para cargar los registros.
def get_records():
    conexion = Conexion("SELECT * FROM movements ORDER BY date DESC, time DESC;")
    rows = conexion.result.fetchall()
    columns = conexion.result.description

    # Creamos una lista de diccionarios con los registros.
    dictionary_list = []

    for r in rows:
        position = 0
        dictionary = {}
        for c in columns:
            dictionary[c[0]] = r[position]
            position += 1

        dictionary_list.append(dictionary)

    conexion.conexion.close()

    # Guardamos el balance de cada crypto en un diccionario.
    crypto_balance = all_cryptos_balance()
        
    dictionary_list.append(crypto_balance)

    return dictionary_list

# Función para consultar la tasa de moneda_from a moneda_to en la API.
def get_rate(moneda_from, moneda_to):
    response = requests.get(API + moneda_from + "/" + moneda_to + "?apikey=" + API_KEY)
    if response.status_code == 200:
        return response.json()["rate"]
    else:
        return ""

# Función para insertar un registro.
def post_record(records):
    # Comprobamos que hay balance positivo en la moneda que se quiere vender.
    if records[2] != "EUR":
        if crypto_quantity(records[2]) < float(records[3]):
            return -1
        
    conexion = Conexion("INSERT INTO movements(date, time, moneda_from, cantidad_from, moneda_to, cantidad_to) VALUES(?, ?, ?, ?, ?, ?);", records)
    conexion.conexion.commit()
    # Guardamos el "id" del último registro.
    id = conexion.cursor.lastrowid
    conexion.conexion.close()
    
    return id

# Función para cargar el estado de la cuenta.
def get_status():
    values = {}

    conexion = Conexion("SELECT ifnull(sum(cantidad_from), 0) FROM movements WHERE moneda_from=\"EUR\";")
    values["invertido"] = conexion.result.fetchall()[0][0]

    conexion = Conexion("SELECT ifnull(sum(cantidad_to), 0) FROM movements WHERE moneda_to=\"EUR\";")
    values["recuperado"] = conexion.result.fetchall()[0][0]

    values["valor_compra"] = values["invertido"] - values["recuperado"]

    # Comprobamos si hay registros de cada crypto para evitar hacer peticiones innecesarias a la API.
    cryptos_total_quantity = 0
    for crypto in cryptos:
        var_crypto_quantity = crypto_quantity(crypto)
        if var_crypto_quantity == 0:
            continue
        else:
            rate = get_rate(crypto, "EUR") 
            if rate == "":
                rate = 0

            cryptos_total_quantity += var_crypto_quantity * rate

    values["valor_actual"] = cryptos_total_quantity

    return values

# Función que comprueba si un usuario existe.
def get_users():
    conexion = Conexion("SELECT email, password FROM users;")

    users = []
    for email in conexion.result.fetchall():
        users.append(email)
        
    return users

# Función para insertar un usuario.
def post_user(user):
    conexion = Conexion("INSERT INTO users(email, password, name, surname) VALUES(?, ?, ?, ?);", user)
    conexion.conexion.commit()
    # Guardamos el "id" del último registro.
    id = conexion.cursor.lastrowid
    conexion.conexion.close()
    
    return id