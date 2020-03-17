import os
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    username = db.Column(db.String(40), primary_key=True, unique=True)
    password_hash = db.Column(db.String)
    password_salt = db.Column(db.String)
    key = db.Column(db.String)
    group_order = db.Column(db.String)

    def __init__(self, username, password_hash, password_salt):
        self.username = username
        self.password_hash = password_hash
        self.password_salt = password_salt


class Preset(db.Model):
    __tablename__ = "preset"
    preset = db.Column(db.String, primary_key=True)
    owner = db.Column(db.String, nullable=False)

    def __init__(self, preset, owner):
        self.preset = preset
        self.owner = owner
