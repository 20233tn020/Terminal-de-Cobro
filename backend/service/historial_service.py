from config.db import get_connection

def mostrar_historial():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
                SELECT
                    u.nombre,
                    u.foto,
                    dp.correo,
                    t.numero_tarjeta,
                    tr.tipo,
                    tr.monto,
                    tr.descripcion,
                    tr.fecha
                FROM transacciones tr
                         JOIN cuentas c ON tr.id_cuenta = c.id_cuenta
                         JOIN usuarios u ON c.id_usuario = u.id_usuario
                         LEFT JOIN datos_personales dp ON u.id_usuario = dp.id_usuario
                         JOIN tarjetas t ON c.id_cuenta = t.id_cuenta
                ORDER BY tr.fecha DESC \
                """

        cursor.execute(query)
        data = cursor.fetchall()

        if not data:
            return {
                "status": False,
                "msg": "No hay historial"
            }

        return {
            "status": True,
            "historial": data
        }

    except Exception as e:
        return {
            "status": False,
            "msg": str(e)
        }

    finally:
        cursor.close()
        connection.close()