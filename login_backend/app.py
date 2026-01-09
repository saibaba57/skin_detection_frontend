from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib

app = Flask(__name__)
CORS(app)

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
    password = hash_password(data.get("password"))

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email, password)
    )
    user = cursor.fetchone()

    # Existing user
    if user:
        return jsonify({
            "success": True,
            "needs_username": user["username"] is None
        })

    # New user → create account
    cursor.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        (email, password)
    )
    conn.commit()

    return jsonify({
        "success": True,
        "needs_username": True
    })


@app.route("/setup-username", methods=["POST"])
def setup_username():
    data = request.json
    email = data.get("email")
    username = data.get("username")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET username=? WHERE email=?",
        (username, email)
    )
    conn.commit()

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)
