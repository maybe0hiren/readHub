import json
import os
from werkzeug.security import generate_password_hash, check_password_hash

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

def user_exists(username):
    users = load_users()
    return username in users

def add_user(username, password):
    users = load_users()
    users[username] = generate_password_hash(password)
    save_users(users)

def verify_user(username, password):
    users = load_users()
    if username in users:
        return check_password_hash(users[username], password)
    return False