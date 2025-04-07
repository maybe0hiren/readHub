from flask import Flask, request, jsonify
from db import user_exists, add_user, verify_user
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from frontend



@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required."}), 400

    if user_exists(username):
        return jsonify({"success": False, "message": "User already exists."}), 409

    add_user(username, password)
    return jsonify({"success": True, "message": "User registered successfully."}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if verify_user(username, password):
        return jsonify({"success": True, "message": "Login successful."}), 200
    else:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
 
if __name__ == "__main__":
    app.run(debug=True)
