"""This file will generate the database and tables if they do not exist yet.
"""

import sqlite3

def setup_database():
    conn = sqlite3.connect("yonder-db.db")
    c = conn.cursor()
    
    # Create tables if they do not exist
    create_users_table(c)
    create_sheets_table(c)
    
    conn.commit()
    conn.close()

def create_users_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        salt TEXT NOT NULL
        );'''
    )
    
def create_sheets_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS sheets (
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        sheet_id INTEGER AUTOINCREMENT,
        content TEXT NOT NULL,
        PRIMARY KEY(sheet_id, user_id)
        ''')