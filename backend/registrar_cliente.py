import pymysql
import bcrypt
import uuid
import random

# Credenciales de tu AWS RDS
DB_HOST = "database-integradora.c7aqoks2cgoh.us-east-1.rds.amazonaws.com"
DB_USER = "admin"
DB_PASS = "Integradora123="
DB_NAME = "SpaceBankClients"


def generar_tarjeta():
    return f"5453 {random.randint(1000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)}"


def registrar_nuevo_cliente(nombre, correo, telefono, direccion, pin_plano, nivel):
    try:
        conexion = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME)

        id_cliente = str(uuid.uuid4())
        num_tarjeta = generar_tarjeta()
        expiracion = "11/28"
        ccv = str(random.randint(100, 999))

        # Asignar línea de crédito según el nivel
        if nivel == "Inversor Estelar":
            linea_credito = 100000.00
        elif nivel == "Inversor Lunar":
            linea_credito = 50000.00
        else:
            linea_credito = 10000.00

        salt = bcrypt.gensalt()
        pin_hash = bcrypt.hashpw(pin_plano.encode('utf-8'), salt).decode('utf-8')

        with conexion.cursor() as cursor:
            # Ahora incluimos linea_credito en el INSERT
            sql_cliente = """INSERT INTO clientes
                             (id_cliente, nombre_completo, correo, telefono, direccion, numero_tarjeta, \
                              fecha_expiracion, ccv, pin_hash, nivel_inversor, linea_credito)
                             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql_cliente,
                           (id_cliente, nombre, correo, telefono, direccion, num_tarjeta, expiracion, ccv, pin_hash,
                            nivel, linea_credito))

            billeteras_iniciales = [
                ("MXN", 150000.00),
                ("USD", 2500.50),
                ("EUR", 0.00),
                ("BTC", 0.025),
                ("ETH", 1.5),
                ("USDT", 500.00),
                ("DOGE", 10000.00)
            ]

            sql_saldo = "INSERT INTO saldos_clientes (id_saldo, id_cliente, moneda, cantidad) VALUES (%s, %s, %s, %s)"
            for moneda, cantidad in billeteras_iniciales:
                id_saldo = str(uuid.uuid4())
                cursor.execute(sql_saldo, (id_saldo, id_cliente, moneda, cantidad))

        conexion.commit()
        print(f"✅ CLIENTE CREADO CON ÉXITO")
        print(f"Nombre: {nombre} | ID: {id_cliente}")
        print(f"Nivel: {nivel} | Crédito Autorizado: ${linea_credito:,.2f}")
        print("Saldos iniciales asignados correctamente.")

    except Exception as e:
        print(f"❌ Error al crear cliente: {e}")
    finally:
        if 'conexion' in locals() and conexion.open:
            conexion.close()


if __name__ == "__main__":
    registrar_nuevo_cliente(
        nombre="Juan Pérez",
        correo="juan.perez@galaxia.com",
        telefono="+52 55 1234 5678",
        direccion="Colonia Lunar, Sector 4, CDMX",
        pin_plano="1234",
        nivel="Inversor Estelar"
    )