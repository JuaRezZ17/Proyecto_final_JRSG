import sqlite3
from config import ORIGIN_DATA

class Conexion:
    def __init__(self, querySql, params=[]):
        self.conexion = sqlite3.connect(ORIGIN_DATA)
        self.cursor = self.conexion.cursor()
        self.resultado = self.cursor.execute(querySql, params)