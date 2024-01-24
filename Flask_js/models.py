from Flask_js.conexion import Conexion
import requests
from Flask_js.utils.utils import API, API_KEY
from Flask_js.utils.functions import cantidad_cripto


# Método para cargar movimientos de la base de datos.
def get_registros():
    # Creamos la conexión y pasamos la query.
    conectar = Conexion("SELECT * FROM movements ORDER BY date DESC;")
    filas = conectar.resultado.fetchall()
    columnas = conectar.resultado.description

    lista_diccionario = []

    for f in filas:
        posicion = 0
        diccionario = {}
        for c in columnas:
            diccionario[c[0]] = f[posicion]
            posicion += 1

        lista_diccionario.append(diccionario)

    conectar.conexion.close()

    return lista_diccionario

# Método para consulta el cambio de moneda_from a moneda_to en API.
def get_tasa(moneda_from, moneda_to):
    response = requests.get(API + moneda_from + "/APIKEY-" + API_KEY)
    response_json = response.json()["rates"]

    for n in range(0, len(response_json)):
        if response_json[n]["asset_id_quote"] == moneda_to:
            return response_json[n]["rate"]
        
    return ""

def post_record(records):
    if records[2] != "EUR":
        if cantidad_cripto(records[2]) < float(records[3]):
            return -1
    conectar = Conexion("INSERT INTO movements(date, time, moneda_from, cantidad_from, moneda_to, cantidad_to) VALUES(?, ?, ?, ?, ?, ?);", records)
    conectar.conexion.commit()
    id = conectar.cursor.lastrowid
    conectar.conexion.close()
    
    return id