from flask import Blueprint, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os

predict_bp = Blueprint("predict", __name__)

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "skin_model.keras")

model = tf.keras.models.load_model(MODEL_PATH)

# Classes (same order used during training)
CLASS_NAMES = [
    "acne",
    "Normal",
    "dry",
    "dry",
    "normal",
    "oily"
]

CONFIDENCE_THRESHOLD = 70
TOP2_THRESHOLD = 50   # 🔥 new rule

@predict_bp.route("/predict", methods=["POST", "OPTIONS"])
def predict():

    if request.method == "OPTIONS":
        return "", 200

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    try:
        # -------- PREPROCESS --------
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))

        arr = np.array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)

        # -------- PREDICT --------
        preds = model.predict(arr)[0]

        # Sort probabilities
        sorted_idx = np.argsort(preds)[::-1]

        top1_idx = sorted_idx[0]
        top2_idx = sorted_idx[1]

        top1_conf = float(preds[top1_idx]) * 100
        top2_conf = float(preds[top2_idx]) * 100

        top1_label = CLASS_NAMES[top1_idx]
        top2_label = CLASS_NAMES[top2_idx]

        results = []

        # Safety filter
        if top1_conf < CONFIDENCE_THRESHOLD:
            results.append({
                "condition": "normal",
                "confidence": round(top1_conf, 2)
            })
        else:
            results.append({
                "condition": top1_label,
                "confidence": round(top1_conf, 2)
            })

        # 🔥 ADD TOP-2 only if ≥ 50%
        if top2_conf >= TOP2_THRESHOLD:
            results.append({
                "condition": top2_label,
                "confidence": round(top2_conf, 2)
            })

        return jsonify({"predictions": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500