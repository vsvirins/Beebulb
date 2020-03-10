from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from os import path

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////' + \
    os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()
ma = Marshmallow()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True, nullable=False)
    password_hash = db.Column(db.String)
    password_salt = db.Column(db.String)
    key = db.Column(db.String)
    group_order = db.Column(db.JSON)
    presets = db.Column(db.JSON)

    def __init__(self, name, password_hash, password_salt):
        self.username = username
        self.password_hash = password_hash
        self.password_salt = password_salt


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'password_hash', 'password_salt',
                  'key', 'group_order', 'presets')


user_schema = UserSchema()
