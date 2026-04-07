from flask import Blueprint,jsonify,request
from service.historial_service import mostrar_historial

historial_bp = Blueprint('historial_bp', __name__)
@historial_bp.route('/historial')
def historial():
    return  jsonify(mostrar_historial())