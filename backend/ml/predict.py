from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from .inference import predict_image

predict_bp = Blueprint("predict", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "../database/uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@predict_bp.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    filename = secure_filename(image.filename)
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    results = predict_image(image_path)
    return jsonify({"predictions": results})
