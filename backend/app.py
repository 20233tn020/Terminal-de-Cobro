from flask import Flask
from flask_cors import CORS
from routes.Mercado_routes import mercado_bp
from routes.users_routes import users_bp
from routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Registrar rutas
    app.register_blueprint(mercado_bp, url_prefix="/api/mercado")
    app.register_blueprint(users_bp, url_prefix="/users")
   # app.register_blueprint(pagos_bp, url_prefix="/api/pagos")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")


    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)



#from routes.pagos_routes import pagos_bp

