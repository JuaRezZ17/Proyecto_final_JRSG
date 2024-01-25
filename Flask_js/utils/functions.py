from Flask_js.conexion import Conexion

def cantidad_cripto(cripto):
    resultados_query = []
    conectar = Conexion(f"SELECT ifnull(sum(cantidad_to), 0) FROM movements WHERE moneda_to=\"{cripto}\";")
    resultados_query.append(conectar.resultado.fetchall()[0][0])
    conectar = Conexion(f"SELECT ifnull(sum(cantidad_from), 0) FROM movements WHERE moneda_from=\"{cripto}\";")
    resultados_query.append(conectar.resultado.fetchall()[0][0])
    conectar.conexion.close()

    return resultados_query[0] - resultados_query[1]