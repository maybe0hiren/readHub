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
    users[username] = {
        "password": generate_password_hash(password),
        "continueReading": []
    }
    save_users(users)


def verify_user(username, password):
    users = load_users()
    if username in users:
        return check_password_hash(users[username]["password"], password)
    return False

def add_continue_reading(username, story):
    users = load_users()
    if username in users:
        if "continueReading" not in users[username]:
            users[username]["continueReading"] = []
        if story not in users[username]["continueReading"]:
            users[username]["continueReading"].append(story)
        save_users(users)

def remove_continue_reading(username, story):
    users = load_users()
    if username in users and "continueReading" in users[username]:
        if story in users[username]["continueReading"]:
            users[username]["continueReading"].remove(story)
        save_users(users)

def get_continue_reading(username):
    users = load_users()
    if username in users and "continueReading" in users[username]:
        return users[username]["continueReading"]
    return []

def change_password(username, new_password):
    users = load_users()
    print("Users loaded:", users)  # DEBUG
    if username in users:
        print(f"Username {username} found. Changing password.")  # DEBUG
        users[username]["password"] = generate_password_hash(new_password)
        save_users(users)
        print("Password saved!")  # DEBUG
        return True
    print(f"Username {username} not found!")  # DEBUG
    return False

