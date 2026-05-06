import sqlite3
import os
from flask import g

DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'status_tracker.db'))

SCHEMA = [
    "CREATE TABLE IF NOT EXISTS achievements (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL, category TEXT NOT NULL, timestamp TEXT NOT NULL, tags TEXT)",
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL, priority TEXT NOT NULL DEFAULT 'medium', status TEXT NOT NULL DEFAULT 'todo', due_date TEXT, created_date TEXT NOT NULL)"
]

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = sqlite3.connect(DATABASE_PATH)
        db.row_factory = sqlite3.Row
        g._database = db
    return db

def init_db():
    db = sqlite3.connect(DATABASE_PATH)
    for statement in SCHEMA:
        db.execute(statement)
    db.commit()
    db.close()

def close_connection(exception=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
