from flask import Blueprint, jsonify, request
from service.mercado_service import (
    obtener_activos,
    obtener_detalles,
    obtener_historial
)

mercado_bp = Blueprint("mercado", __name__)

# 🔹 Lista de criptos
@mercado_bp.route("/activos", methods=["GET"])
def activos():
    try:
        data = obtener_activos()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔹 Detalles de una moneda
@mercado_bp.route("/detalles/<coin_id>", methods=["GET"])
def detalles(coin_id):
    try:
        data = obtener_detalles(coin_id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔹 Historial para gráfica
@mercado_bp.route("/historial/<coinId>", methods=["GET"])
def historial(coinId):
    try:
        days = int(request.args.get("days", 1))
        data = obtener_historial(coinId, days)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500