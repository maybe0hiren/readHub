from flask import Flask, request, jsonify
from db import user_exists, add_user, verify_user, add_continue_reading, remove_continue_reading, get_continue_reading
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 



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

@app.route("/save-progress", methods=["POST"])
def save_progress():
    data = request.get_json()
    username = data.get("username")
    story = data.get("story")
    if not username or not story:
        return jsonify({"success": False, "message": "Username and story required."}), 400
    add_continue_reading(username, story)
    return jsonify({"success": True, "message": "Progress saved."})

@app.route("/complete-story", methods=["POST"])
def complete_story():
    data = request.get_json()
    username = data.get("username")
    story = data.get("story")
    if not username or not story:
        return jsonify({"success": False, "message": "Username and story required."}), 400
    remove_continue_reading(username, story)
    return jsonify({"success": True, "message": "Story completed."})

@app.route("/progress", methods=["GET"])
def get_progress():
    username = request.args.get("username")
    if not username:
        return jsonify({"success": False, "message": "Username required."}), 400
    progress = get_continue_reading(username)
    return jsonify({"success": True, "progress": progress})


if __name__ == "__main__":
    app.run(debug=True)
