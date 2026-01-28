from flask import Flask
from flask_cors import CORS
import os

from auth.routes import auth_bp
from ml.predict import predict_bp

app = Flask(__name__)
app.secret_key = "supersecret"

# ✅ FIXED CORS (mobile + netlify safe)
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "*"}}
)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)

@app.route("/")
def home():
    return "Backend running successfully"

# ✅ FIXED Render-compatible run
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)