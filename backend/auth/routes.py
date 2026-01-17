from flask import Blueprint, request, jsonify, session
from flask_cors import CORS
import sqlite3
import hashlib
import os

auth_bp = Blueprint("auth", __name__)
CORS(auth_bp, supports_credentials=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "../database/users.db")

# ---------- DATABASE ----------
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            username TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()

# ---------- HELPERS ----------
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ---------- ROUTES ----------

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():

    # 🔥 Handle CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False}), 400

    hashed = hash_password(password)
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email, hashed)
    )
    user = cursor.fetchone()

    if user:
        session["user_id"] = user["id"]
        conn.close()
        return jsonify({
            "success": True,
            "needs_username": user["username"] is None
        })

    # Auto-register if not exists
    cursor.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        (email, hashed)
    )
    conn.commit()
    session["user_id"] = cursor.lastrowid
    conn.close()

    return jsonify({
        "success": True,
        "needs_username": True
    })


@auth_bp.route("/setup-username", methods=["POST", "OPTIONS"])
def setup_username():

    if request.method == "OPTIONS":
        return "", 200

    if "user_id" not in session:
        return jsonify({"success": False}), 401

    username = request.json.get("username")
    if not username:
        return jsonify({"success": False}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET username=? WHERE id=?",
        (username, session["user_id"])
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True})


@auth_bp.route("/logout", methods=["POST", "OPTIONS"])
def logout():

    if request.method == "OPTIONS":
        return "", 200

    session.clear()
    return jsonify({"success": True})