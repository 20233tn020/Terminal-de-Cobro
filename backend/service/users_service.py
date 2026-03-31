from config.db import get_connection

def get_all_users():
    conn = None
    cursor = None

    try:
        conn = get_connection()

        if conn is None:
            return []

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios")
        users = cursor.fetchall()

        return users

    except Exception as e:
        print("Error en get_all_users:", e)
        return []

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_user_full(id_usuario):
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
                SELECT
                    u.id_usuario,
                    u.nombre,
                    u.foto,

                    dp.correo,
                    dp.telefono,
                    dp.direccion,

                    c.saldo_disponible,
                    c.linea_credito,

                    t.numero_tarjeta,
                    t.nombre_tarjeta,
                    t.tipo_tarjeta,
                    t.fecha_vencimiento,
                    t.CVV

                FROM usuarios u
                         LEFT JOIN datos_personales dp ON u.id_usuario = dp.id_usuario
                         LEFT JOIN cuentas c ON u.id_usuario = c.id_usuario
                         LEFT JOIN tarjetas t ON c.id_cuenta = t.id_cuenta

                WHERE u.id_usuario = %s \
                """

        cursor.execute(query, (id_usuario,))
        user = cursor.fetchone()

        return user

    except Exception as e:
        print("Error:", e)
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()