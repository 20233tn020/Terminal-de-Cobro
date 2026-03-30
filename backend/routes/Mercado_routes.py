from flask import Blueprint, jsonify, request
from service.mercado_service import (
    obtener_activos,
    obtener_detalles,
    obtener_historial
)

mercado_bp = Blueprint("mercado", __name__)

# 🔹 Lista completa
@mercado_bp.route("/activos")
def activos():
    return jsonify(obtener_activos())


# 🔹 Detalles de moneda (BTC, ETH, etc.)
@mercado_bp.route("/detalles/<coin_id>")
def detalles(coin_id):
    return jsonify(obtener_detalles(coin_id))


# 🔹 Historial dinámico (día, mes, año)
@mercado_bp.route("/historial/<coin_id>")
def historial(coin_id):
    dias_param = request.args.get("dias", "1")

    if dias_param.isdigit():
        dias = int(dias_param)
    else:
        dias = 1
    return jsonify(obtener_historial(coin_id, dias))