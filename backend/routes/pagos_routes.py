# ========================================
# SOLAMENTE OPREACIONES (DEPOSITOS, RETIRAR, TRANFERENCIAS Y CAMBIO DE DIVISAS )

from flask import Blueprint, request, jsonify
from service.pagos_service import (
    realizar_deposito,
    retirar_efectivo,
    realizar_transferencia
)

pagos_bp = Blueprint("pagos", __name__)

# ===========================
# 💰 DEPÓSITO
# ===========================
@pagos_bp.route("/deposito", methods=["POST"])
def deposito():
    data = request.get_json()

    numero_tarjeta = data.get("numero_tarjeta")
    monto = data.get("monto")
    tipo = data.get("tipo")  # debito | credito

    result = realizar_deposito(numero_tarjeta, monto, tipo)

    return jsonify(result)

# ===========================
# 💸 RETIRO
# ===========================
@pagos_bp.route("/retiro", methods=["POST"])
def retiro():
    data = request.get_json()

    numero_tarjeta = data.get("numero_tarjeta")
    monto = data.get("monto")
    tipo = data.get("tipo")  # debito | credito
    nip = data.get("nip")

    result = retirar_efectivo(numero_tarjeta, monto, tipo, nip)

    return jsonify(result)

# ===========================
# 🔄 TRANSFERENCIA
# ===========================
@pagos_bp.route("/transferencia", methods=["POST"])
def transferencia():
    data = request.get_json()

    tarjeta_origen = data.get("tarjeta_origen")
    tarjeta_destino = data.get("tarjeta_destino")
    monto = data.get("monto")
    nip_ingresado = data.get("nip")
    metodo_tarjeta = data.get("tipo")

    result = realizar_transferencia(tarjeta_origen, tarjeta_destino, monto,nip_ingresado,metodo_tarjeta)
    return jsonify(result)