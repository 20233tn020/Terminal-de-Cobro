from flask import Flask
from flask_cors import CORS
from routes.Mercado_routes import mercado_bp


app = Flask(__name__)
CORS(app)  # 🔥 Permite conexión con React

# Registrar rutas
app.register_blueprint(mercado_bp, url_prefix="/api/mercado")

if __name__ == "__main__":
    app.run(debug=True)