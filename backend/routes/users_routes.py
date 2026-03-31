from flask import Blueprint, jsonify
from service.users_service import get_all_users, get_user_full

users_bp = Blueprint("users", __name__)

# ==========================
# TODOS LOS USUARIOS
# ==========================
@users_bp.route("/", methods=["GET"])
def users():
    data = get_all_users()

    if not data:
        return jsonify({"message": "No hay usuarios"}), 404

    return jsonify(data), 200

# ==========================
# USUARIO COMPLETO
# ==========================
@users_bp.route("/<int:id_usuario>", methods=["GET"])
def get_user(id_usuario):
    try:
        user = get_user_full(id_usuario)

        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        return jsonify(user), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500