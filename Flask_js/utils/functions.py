from Flask_js.utils.utils import cryptos
from Flask_js.conexion import Conexion

# Función que devuelve un diccionario la cantidad de cada crypto que posee un usuario específico.
def all_cryptos_balance(id):
    crypto_balance = {}

    for crypto in cryptos:
        crypto_balance[crypto.lower()] = crypto_quantity(crypto, id)

    return crypto_balance

#Función que devuelve la cantidad total de una crypto que posee un usuario específico.
def crypto_quantity(crypto, id):
    query_results = []
    conexion = Conexion(f"SELECT ifnull(sum(cantidad_to), 0) FROM movements WHERE moneda_to=\"{crypto}\" AND user_id=" + id + ";")
    query_results.append(conexion.result.fetchall()[0][0])
    conexion = Conexion(f"SELECT ifnull(sum(cantidad_from), 0) FROM movements WHERE moneda_from=\"{crypto}\" AND user_id=" + id + ";")
    query_results.append(conexion.result.fetchall()[0][0])
    conexion.conexion.close()

    return query_results[0] - query_results[1]