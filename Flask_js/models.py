from Flask_js.conexion import Conexion
import requests
from Flask_js.utils.utils import API, API_KEY, criptos
from Flask_js.utils.functions import cantidad_cripto

# Método para cargar movimientos de la base de datos.
def get_records():
    # Creamos la conexión y pasamos la query.
    conexion = Conexion("SELECT * FROM movements ORDER BY date DESC;")
    filas = conexion.resultado.fetchall()
    columnas = conexion.resultado.description

    lista_diccionario = []

    for f in filas:
        posicion = 0
        diccionario = {}
        for c in columnas:
            diccionario[c[0]] = f[posicion]
            posicion += 1

        lista_diccionario.append(diccionario)

    conexion.conexion.close()

    return lista_diccionario

# Método para consulta el cambio de moneda_from a moneda_to en API.
def get_rate(moneda_from, moneda_to):
    response = requests.get(API + moneda_from + "/" + moneda_to + "?apikey=" + API_KEY)
    return response.json()["rate"]

def post_record(records):
    if records[2] != "EUR":
        if cantidad_cripto(records[2]) < float(records[3]):
            return -1
        
    conexion = Conexion("INSERT INTO movements(date, time, moneda_from, cantidad_from, moneda_to, cantidad_to) VALUES(?, ?, ?, ?, ?, ?);", records)
    conexion.conexion.commit()
    id = conexion.cursor.lastrowid
    conexion.conexion.close()
    
    return id

def get_status():
    values = {}

    conexion = Conexion("SELECT ifnull(sum(cantidad_from), 0) FROM movements WHERE moneda_from=\"EUR\";")
    values["invertido"] = conexion.resultado.fetchall()[0][0];

    conexion = Conexion("SELECT ifnull(sum(cantidad_to), 0) FROM movements WHERE moneda_to=\"EUR\";")
    values["recuperado"] = conexion.resultado.fetchall()[0][0];

    values["valor_compra"] = values["invertido"] - values["recuperado"];

    crypto_quantity = 0
    for cripto in criptos:
        crypto_quantity += cantidad_cripto(cripto) * get_rate(cripto, "EUR")

    values["valor_actual"] = crypto_quantity

    return values