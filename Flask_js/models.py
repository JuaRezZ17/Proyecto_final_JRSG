from Flask_js.conexion import Conexion
import requests
from Flask_js.utils.utils import API, API_KEY

def select_all():
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

def get_tasa(moneda_from, moneda_to):
    response = requests.get(API + moneda_from + "/APIKEY-" + API_KEY)
    response_json = response.json()["rates"]

    for n in range(0, len(response_json)):
        if response_json[n]["asset_id_quote"] == moneda_to:
            return response_json[n]["rate"]