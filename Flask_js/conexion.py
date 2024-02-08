import sqlite3
from config import ORIGIN_DATA

# Creamos la clase para conectarnos a la base de datos.
class Conexion:
    def __init__(self, querySql, params=[]):
        # Creamos la conexión a la base de datos.
        self.conexion = sqlite3.connect(ORIGIN_DATA)
        # Creamos un cursor para acceder a los datos.
        self.cursor = self.conexion.cursor()
        # Ejecutamos la query y guardamos los resultados.
        self.result = self.cursor.execute(querySql, params)