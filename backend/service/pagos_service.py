from config.db import get_connection
from decimal import Decimal


# ===========================
# 💰 DEPÓSITO
# ===========================
def realizar_deposito(numero_tarjeta, monto, tipo):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # 🔍 Buscar cuenta
        cursor.execute("""
                       SELECT c.id_cuenta, c.saldo_disponible, c.linea_credito
                       FROM tarjetas t
                                JOIN cuentas c ON t.id_cuenta = c.id_cuenta
                       WHERE t.numero_tarjeta = %s
                       """, (numero_tarjeta,))

        cuenta = cursor.fetchone()

        if not cuenta:
            return {"status": False, "msg": "Tarjeta no válida"}

        monto = Decimal(monto)

        # 💳 DÉBITO
        if tipo == "debito":
            nuevo_saldo = cuenta["saldo_disponible"] + monto

            cursor.execute("""
                           UPDATE cuentas
                           SET saldo_disponible = %s
                           WHERE id_cuenta = %s
                           """, (nuevo_saldo, cuenta["id_cuenta"]))

        # 💳 CRÉDITO
        elif tipo == "credito":
            nueva_linea = cuenta["linea_credito"] + monto

            cursor.execute("""
                           UPDATE cuentas
                           SET linea_credito = %s
                           WHERE id_cuenta = %s
                           """, (nueva_linea, cuenta["id_cuenta"]))

        else:
            return {"status": False, "msg": "Tipo inválido"}

        # 🧾 HISTORIAL
        cursor.execute("""
                       INSERT INTO transacciones (id_cuenta, tipo, monto, descripcion)
                       VALUES (%s, 'deposito', %s, %s)
                       """, (
                           cuenta["id_cuenta"],
                           monto,
                           f"Depósito a {tipo}"
                       ))

        connection.commit()

        return {
            "status": True,
            "msg": "Depósito realizado correctamente"
        }

    except Exception as e:
        connection.rollback()
        return {"status": False, "msg": str(e)}

    finally:
        cursor.close()
        connection.close()



# ===========================
# 💸 RETIRO
# ===========================
def retirar_efectivo(numero_tarjeta, monto, tipo, nip):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # 🔍 Buscar cuenta
        cursor.execute("""
                       SELECT c.id_cuenta,
                              c.saldo_disponible,
                              c.linea_credito,
                              t.nip
                       FROM tarjetas t
                                JOIN cuentas c ON t.id_cuenta = c.id_cuenta
                       WHERE t.numero_tarjeta = %s
                       """, (numero_tarjeta,))

        cuenta = cursor.fetchone()

        if not cuenta:
            return {"status": False, "msg": "El numero de cuenta no valida"}

        monto = Decimal(monto)

        if nip!= cuenta["nip"]:
            return {"status": False, "msg": "NIP incorrecto"}

        if tipo == "debito":

            if monto > cuenta["saldo_disponible"]:
                return {"status": False, "msg": "Saldo insuficiente"}

            nuevo_saldo = cuenta["saldo_disponible"] - monto

            cursor.execute("""
                           UPDATE cuentas
                           SET saldo_disponible = %s
                           WHERE id_cuenta = %s
                           """, (nuevo_saldo, cuenta["id_cuenta"]))

        elif tipo == "credito":

            if monto > cuenta["linea_credito"]:
                return {"status": False, "msg": "Linea de credito insuficiente"}

            nueva_linea = cuenta["linea_credito"] - monto

            cursor.execute("""
                           UPDATE cuentas
                           SET linea_credito = %s
                           WHERE id_cuenta = %s
                           """, (nueva_linea, cuenta["id_cuenta"]))

        else:
            return {"status": False, "msg": "El tipo  de tarjeta invalido"}

        cursor.execute("""
                       INSERT INTO transacciones (id_cuenta, tipo, monto, descripcion)
                       VALUES (%s, 'retiro', %s, %s)
                       """, (
                           cuenta["id_cuenta"],
                           monto,
                           f"Retiro de {tipo}"
                       ))

        connection.commit()

        return {
            "status": True,
            "msg": "Retiro  exitoso"
        }

    except Exception as e:
        connection.rollback()
        return {"status": False, "msg": str(e)}

    finally:
        cursor.close()
        connection.close()



# ===========================
# 🔄 TRANSFERENCIA
# ===========================
def realizar_transferencia(origen, destino, monto):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        monto = Decimal(monto)

        # 🔍 ORIGEN
        cursor.execute("""
                       SELECT c.id_cuenta, c.saldo_disponible
                       FROM tarjetas t
                                JOIN cuentas c ON t.id_cuenta = c.id_cuenta
                       WHERE t.numero_tarjeta = %s
                       """, (origen,))
        cuenta_origen = cursor.fetchone()

        # 🔍 DESTINO
        cursor.execute("""
                       SELECT c.id_cuenta
                       FROM tarjetas t
                                JOIN cuentas c ON t.id_cuenta = c.id_cuenta
                       WHERE t.numero_tarjeta = %s
                       """, (destino,))
        cuenta_destino = cursor.fetchone()

        if not cuenta_origen or not cuenta_destino:
            return {"status": False, "msg": "Cuenta no encontrada"}

        # 💥 VALIDAR SALDO
        if monto > cuenta_origen["saldo_disponible"]:
            return {"status": False, "msg": "Fondos insuficientes"}

        # 🔻 RESTAR ORIGEN
        nuevo_saldo = cuenta_origen["saldo_disponible"] - monto

        cursor.execute("""
                       UPDATE cuentas
                       SET saldo_disponible = %s
                       WHERE id_cuenta = %s
                       """, (nuevo_saldo, cuenta_origen["id_cuenta"]))

        # 🔺 SUMAR DESTINO
        cursor.execute("""
                       UPDATE cuentas
                       SET saldo_disponible = saldo_disponible + %s
                       WHERE id_cuenta = %s
                       """, (monto, cuenta_destino["id_cuenta"]))

        # 🧾 HISTORIAL ORIGEN
        cursor.execute("""
                       INSERT INTO transacciones (id_cuenta, tipo, monto, descripcion)
                       VALUES (%s, 'transferencia', %s, %s)
                       """, (
                           cuenta_origen["id_cuenta"],
                           monto,
                           f"Transferencia enviada"
                       ))

        # 🧾 HISTORIAL DESTINO
        cursor.execute("""
                       INSERT INTO transacciones (id_cuenta, tipo, monto, descripcion)
                       VALUES (%s, 'deposito', %s, %s)
                       """, (
                           cuenta_destino["id_cuenta"],
                           monto,
                           f"Transferencia recibida"
                       ))

        connection.commit()

        return {
            "status": True,
            "msg": "Transferencia exitosa"
        }

    except Exception as e:
        connection.rollback()
        return {"status": False, "msg": str(e)}

    finally:
        cursor.close()
        connection.close()