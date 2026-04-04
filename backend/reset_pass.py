import pymysql
import bcrypt

DB_HOST = "database-integradora.c7aqoks2cgoh.us-east-1.rds.amazonaws.com"
DB_USER = "admin"
DB_PASS = "Integradora123="
DB_NAME = "loginAdmin"  # Confirma que este sea el nombre correcto


def forzar_password():
    # Encriptamos la palabra "admin" de forma segura
    salt = bcrypt.gensalt()
    hash_pass = bcrypt.hashpw(b"admin", salt)

    conexion = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME)

    with conexion.cursor() as cursor:
        # Actualizamos específicamente al usuario 'admin'
        sql = "UPDATE administradores SET contrasena = %s WHERE nombre = 'admin'"
        cursor.execute(sql, (hash_pass.decode('utf-8'),))

    conexion.commit()
    conexion.close()
    print("✅ Contraseña del usuario 'admin' forzada a: 'admin'")


if __name__ == "__main__":
    forzar_password()