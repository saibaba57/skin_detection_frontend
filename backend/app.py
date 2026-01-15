from flask import Flask
from flask_cors import CORS

from auth.routes import auth_bp
from ml.predict import predict_bp

app = Flask(__name__)
app.secret_key = "cutis_ai_secret_key"

CORS(app, supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)

if __name__ == "__main__":
    app.run(debug=True)
