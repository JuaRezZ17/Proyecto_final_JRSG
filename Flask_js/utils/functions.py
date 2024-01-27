from Flask_js.conexion import Conexion

def crypto_quantity(crypto):
    query_results = []
    conexion = Conexion(f"SELECT ifnull(sum(cantidad_to), 0) FROM movements WHERE moneda_to=\"{crypto}\";")
    query_results.append(conexion.result.fetchall()[0][0])
    conexion = Conexion(f"SELECT ifnull(sum(cantidad_from), 0) FROM movements WHERE moneda_from=\"{crypto}\";")
    query_results.append(conexion.result.fetchall()[0][0])
    conexion.conexion.close()

    return query_results[0] - query_results[1]