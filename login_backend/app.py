from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import hashlib

app = Flask(__name__)
app.secret_key = "cutis_ai_secret_key"
CORS(app, supports_credentials=True)

DB_NAME = "login_backend/users.db"


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

@app.route("/login", methods=["POST"])
def login():
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


@app.route("/setup-username", methods=["POST"])
def setup_username():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Not logged in"}), 401

    data = request.json
    username = data.get("username")

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


@app.route("/me", methods=["GET"])
def me():
    if "user_id" not in session:
        return jsonify({"logged_in": False}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT email, username FROM users WHERE id=?",
        (session["user_id"],)
    )
    user = cursor.fetchone()
    conn.close()

    return jsonify({
        "logged_in": True,
        "email": user["email"],
        "username": user["username"]
    })


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)
