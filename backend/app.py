from flask import Flask
from flask_cors import CORS
from database import init_extensions
from routes import register_blueprints

def create_app():
    app = Flask(__name__)
    
    # Configure Flask to handle trailing slashes consistently
    app.url_map.strict_slashes = False
    
    # Configure CORS to allow requests from frontend
    CORS(app, 
         origins=["*"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    init_extensions(app)
    register_blueprints(app)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}, 200

    return app

if __name__ == "__main__": 
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)

