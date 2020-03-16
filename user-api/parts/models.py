import os
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True, nullable=False)
    password_hash = db.Column(db.String)
    password_salt = db.Column(db.String)
    key = db.Column(db.String)
    group_order = db.Column(db.JSON)
    presets = db.Column(db.JSON)

    def __init__(self, username, password_hash, password_salt):
        self.username = username
        self.password_hash = password_hash
        self.password_salt = password_salt
