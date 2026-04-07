from config.AdminDb import  get_connection
from werkzeug.security import check_password_hash

def authenticate(usuario, password):
    connection = get_connection()
    cursor = connection.cursor()

from config.AdminDb import  get_connection
from werkzeug.security import check_password_hash

def authenticate(usuario, password):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
                       SELECT * FROM admin
                       WHERE correo = %s AND contrasena = %s
                       """, (usuario, password))

        user_db = cursor.fetchone()

        if user_db:
            return {
                "status": True,
                "msj": "CREDENCIALES CORRECTA",
                "user": user_db
            }
        else:
            return {
                "status": False,
                "msj": "CREDENCIALES INCORRECTAS"
            }

    except Exception as e:
        return {
            "status": False,
            "msj": str(e)
        }

    finally:
        cursor.close()
        connection.close()