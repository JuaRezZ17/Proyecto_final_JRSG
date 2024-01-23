from Flask_js.conexion import Conexion

def cantidad_cripto(cripto):
    resultados_query = []
    conectar_to = Conexion(f"SELECT SUM(cantidad_to) FROM movements WHERE moneda_to=\"{moneda_from}\";")
    resultados_query.append(conectar_to.resultado.fetchall()[0][0])
    conectar_to = Conexion(f"SELECT SUM(cantidad_from) FROM movements WHERE moneda_from=\"{moneda_from}\";")
    resultados_query.append(conectar_to.resultado.fetchall()[0][0])
    conectar_to.conexion.close()

    return resultados_query[0] - resultados_query[1]