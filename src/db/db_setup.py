"""This file will generate the database and tables if they do not exist yet.
"""

import sqlite3

def setup_database():
    conn = sqlite3.connect("./src/db/yonder-db.db")
    c = conn.cursor()
    
    # Create tables if they do not exist
    create_users_table(c)
    create_sheets_table(c)
    
    conn.commit()
    conn.close()

def create_users_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
        hashed_email TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        salt TEXT NOT NULL
        );'''
    )
    
def create_sheets_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS sheets (
        sheet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        hashed_email TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY(hashed_email) REFERENCES users(hashed_email)
        );''')
    
def create_classes_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS classes (
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
    
def create_class_features_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS class_features (
        class_name TEXT NOT NULL,
        feature_name TEXT NOT NULL,
        content TEXT,
        FOREIGN KEY(class_name) REFERENCES classes(name)
        );''')
    
setup_database()