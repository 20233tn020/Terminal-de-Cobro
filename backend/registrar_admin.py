import pymysql
import bcrypt
import uuid

# Credenciales de tu AWS RDS
DB_HOST = "database-integradora.c7aqoks2cgoh.us-east-1.rds.amazonaws.com"
DB_USER = "admin"
DB_PASS = "Integradora123="
DB_NAME = "loginAdmin"


def registrar_usuario(nombre, correo, contrasena_plana, foto_url=None):
    try:
        # 1. Encriptar contraseña
        salt = bcrypt.gensalt()
        contrasena_hash = bcrypt.hashpw(contrasena_plana.encode('utf-8'), salt)

        # 2. Generar UUID
        nuevo_id = str(uuid.uuid4())

        # URL por defecto si no se manda una
        if not foto_url:
            foto_url = "https://drive.google.com/file/d/11_KyUHAS_P__yUL0-WmuCqNsoem_RW4i/view?usp=sharing"

        # 3. Conexión a la DB
        conexion = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )

        with conexion.cursor() as cursor:
            sql = """INSERT INTO administradores (id_admin, nombre, correo, contrasena, foto)
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (nuevo_id, nombre, correo, contrasena_hash.decode('utf-8'), foto_url))

        conexion.commit()
        print(f"✅ Éxito: Usuario '{nombre}' registrado correctamente con ID: {nuevo_id}")

    except pymysql.MySQLError as e:
        print(f"❌ Error en la base de datos: {e}")
    except Exception as e:
        print(f"❌ Ocurrió un error: {e}")
    finally:
        if 'conexion' in locals() and conexion.open:
            conexion.close()


if __name__ == "__main__":
    print("--- Registro de Administrador SpaceBank ---")

    # Datos de ejemplo que pediste
    usr_nombre = "admin"
    usr_pass = "admin"
    usr_correo = "example@gmail.com"

    registrar_usuario(usr_nombre, usr_correo, usr_pass)