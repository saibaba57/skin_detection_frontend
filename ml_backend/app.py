from flask import Flask, request, jsonify
import os
import tensorflow as tf
import numpy as np
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)

# ===============================
# FIX 1: Correct model path
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "skin_model.keras")

model = tf.keras.models.load_model(MODEL_PATH)

class_names = ['acne', 'dry', 'fungal', 'normal', 'oily']

# ===============================
# FIX 2: Upload folder path
# ===============================
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return "Skin Detection Backend is Running"

# ===============================
# Image preprocessing
# ===============================
def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(image.filename)
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    img = preprocess_image(image_path)
    preds = model.predict(img)[0]

    result = []
    for i, score in enumerate(preds):
        result.append({
            "condition": class_names[i],
            "confidence": round(float(score), 3)
        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
