from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from db import (
    user_exists, add_user, verify_user,
    add_continue_reading, remove_continue_reading, get_continue_reading,
    change_password
)

from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500"])

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
    if story == "index.html" or story == "":
        return jsonify({"success": False, "message": "Cannot save progress for index.html or empty story."}), 400
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

# ----------------------------------
# New route for backward compatibility with old storyScript.js version
# This allows POST requests to /progress to also save progress
# ----------------------------------
@app.route("/progress", methods=["POST"])
def legacy_save_progress():
    data = request.get_json()
    username = data.get("username")
    story = data.get("story")
    if not username or not story:
        return jsonify({"success": False, "message": "Username and story required."}), 400
    if story == "index.html" or story == "":
        return jsonify({"success": False, "message": "Cannot save progress for index.html or empty story."}), 400
    add_continue_reading(username, story)
    return jsonify({"success": True, "message": "Progress saved (legacy route)."})

# ----------------------------------
# New route to handle story completion when user scrolls to the bottom
# Called from scripts.js using /finish
# ----------------------------------
@app.route("/finish", methods=["POST"])
def mark_finished():
    data = request.get_json()
    username = data.get("username")
    story = data.get("story")
    if not username or not story:
        return jsonify({"success": False, "message": "Username and story required."}), 400
    remove_continue_reading(username, story)
    return jsonify({"success": True, "message": "Story marked as finished."})

@app.route('/change-password', methods=['GET', 'POST'])
def change_password_route():
    if request.method == 'POST':
        username = request.form['username']
        old_password = request.form['old_password']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        # Check if user exists
        if not user_exists(username):
            flash('User does not exist!', 'error')
            return redirect(url_for('change_password_route'))

        # Verify old password
        if not verify_user(username, old_password):
            flash('Old password is incorrect!', 'error')
            return redirect(url_for('change_password_route'))

        # Check if new passwords match
        if new_password != confirm_password:
            flash('New passwords do not match!', 'error')
            return redirect(url_for('change_password_route'))

        # Change password using db helper
        change_password(username, new_password)

        flash('Password changed successfully!', 'success')
        return redirect(url_for('change_password_route'))

    return render_template('change_password.html')


@app.route('/api/change-password', methods=['POST'])
def api_change_password():
    data = request.get_json()

    username = data.get('username')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if not username or not old_password or not new_password or not confirm_password:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    if not user_exists(username):
        return jsonify({"success": False, "message": "User does not exist."}), 404

    if not verify_user(username, old_password):
        return jsonify({"success": False, "message": "Old password is incorrect."}), 401

    if new_password != confirm_password:
        return jsonify({"success": False, "message": "New passwords do not match."}), 400

    if change_password(username, new_password):
        return jsonify({"success": True, "message": "Password changed successfully."}), 200
    else:
        return jsonify({"success": False, "message": "Failed to change password."}), 500



if __name__ == "__main__":
    app.run(debug=True)
