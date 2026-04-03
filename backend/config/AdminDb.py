import pymysql
def get_connection():
    try:
        connection = pymysql.connect(
            host="database-integradora.c7aqoks2cgoh.us-east-1.rds.amazonaws.com",
            user="admin",
            password="Integradora123=",
            database="loginAdmin",
            port=3306,
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.Error as e:
        import traceback
        traceback.print_exc()
        return None
def test_connection():
    conn = get_connection()
    if conn:
        print("Conexión exitosa")
        conn.close()
    else:
        print("Error de conexión")