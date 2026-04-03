# ==============================================
# LOGIN EMPLEADO
# ==============================================

from flask import Blueprint, request, jsonify
from service.auth_service import authenticate

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
     data = request.get_json()

     usuario = data.get("usuario")
     password = data.get("password")

     result = authenticate(usuario, password)

     return jsonify(result)