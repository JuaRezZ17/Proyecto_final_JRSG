from Flask_js.conexion import Conexion

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