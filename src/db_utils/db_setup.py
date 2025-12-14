"""This file will generate the database and tables if they do not exist yet.
"""

import sqlite3
import hashlib
from pathlib import Path

def setup_database(db_path : str):
    db_path_str: str = db_path
    db_path_path: Path = Path(db_path_str)

    # Ensure parent directory exists (important for Docker volumes)
    db_path_path.parent.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Create tables if they do not exist
    create_users_table(c)
    create_sheets_table(c)
    create_classes_table(c)
    create_subclasses_table(c)
    create_spells_table(c)
    create_races_table(c)
    create_weapons_table(c)
    create_tools_table(c)
    create_miscellaneous_table(c)
    create_armors_table(c)
    set_admin_users(c)
    
    
    conn.commit()
    conn.close()



def create_users_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
        username TEXT NOT NULL UNIQUE,
        is_admin BOOLEAN DEFAULT 0
        );'''
    )
    
def create_sheets_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS sheets (
        sheet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        shared BOOLEAN DEFAULT 0,
        FOREIGN KEY(username) REFERENCES users(username)
        );''')
    
def create_classes_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS classes (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_subclasses_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS subclasses (
        name TEXT NOT NULL,
        class_name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_spells_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS spells (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_races_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS races (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_weapons_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS weapons (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_tools_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS tools (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_miscellaneous_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS miscellaneous (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_armors_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS armors (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def set_admin_users(c):
    admin_users = ["Gilbio","Admin"]  # List of admin usernames
    for admin in admin_users:
      username = hash(admin)
      c.execute('UPDATE users SET is_admin = 1 WHERE username = ?;', (username,))
        
def hash(input: str) -> str:
    return hashlib.sha256(input.encode()).hexdigest()
    
# setup_database()