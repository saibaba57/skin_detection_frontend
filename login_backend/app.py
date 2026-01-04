from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = "cutis_ai_secret_key"

# -----------------------------
# TEMP USER STORAGE (NO DB)
# -----------------------------
users = {
    "admin@cutis.ai": {
        "password": "123456",
        "name": "Admin User"
    }
}

@app.route("/")
def home():
    return "Cutis AI Backend Running"

# -----------------------------
# LOGIN API
# -----------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if email in users:
        if users[email]["password"] == password:
            session["user"] = email
            return jsonify({
                "success": True,
                "new_user": False,
                "message": "Login successful"
            })
        else:
            return jsonify({
                "success": False,
                "message": "Incorrect password"
            }), 401

    # New user
    users[email] = {
        "password": password,
        "name": email.split("@")[0]
    }
    session["user"] = email

    return jsonify({
        "success": True,
        "new_user": True,
        "message": "New user created"
    })

@app.route("/me")
def me():
    if "user" in session:
        email = session["user"]
        return jsonify({
            "logged_in": True,
            "email": email,
            "name": users[email]["name"]
        })
    return jsonify({"logged_in": False}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"success": True})

if __name__ == "__main__":
    print("Starting Cutis AI backend...")
    app.run(host="127.0.0.1", port=5000, debug=True)
