from flask import Flask
from flask_cors import CORS

from auth.routes import auth_bp
from ml.predict import predict_bp   # 🔥 correct import

app = Flask(__name__)
app.secret_key = "supersecret"      # required for session

# Enable CORS properly
CORS(app, supports_credentials=True)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)

@app.route("/")
def home():
    return "Backend running successfully"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)