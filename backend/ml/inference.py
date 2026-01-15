import tensorflow as tf
import numpy as np
from PIL import Image
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "skin_model.keras")

_model = None  # cache

CLASS_NAMES = ["acne", "dry", "fungal", "normal", "oily"]

def load_model():
    global _model
    if _model is None:
        print("🔥 Loading ML model...")
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model

def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def predict_image(image_path):
    model = load_model()
    img = preprocess_image(image_path)
    preds = model.predict(img)[0]

    results = []
    for i, score in enumerate(preds):
        if float(score) >= 0.5:
            results.append({
                "condition": CLASS_NAMES[i],
                "confidence": round(float(score) * 100, 2)
            })

    if not results:
        results.append({
            "condition": CLASS_NAMES[int(np.argmax(preds))],
            "confidence": round(float(np.max(preds)) * 100, 2)
        })

    return results
