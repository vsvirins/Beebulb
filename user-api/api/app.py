from flask import Flask, request, jsonify
from os import path

import api.passhash
from api.models import *

app = Flask(__name__)


db = api.models.db
ma = api.models.ma
db.init_app(app)
ma.init_app(app)


@app.route('/register', methods=['POST'])
def new_user(username, password):
    exists = db.session.query(db.exists().where(
        User.username == username)).scalar()
    if exists:
        return 'username already exists'
    if username & password == '':
        return 'unvalid username or password'

    password_tuple = api.passhash.generate_password(password)
    password_hash = password_tuple[0]
    password_salt = password_tuple[1]

    user = api.models.User(username=username, password_hash=password_hash,
                           password_salt=password_salt)
    db.session.add(user)

    return jsonify({'msg': f'Welcome {username}.'})


@app.route('/login', methods=['GET'])
def login(username, password):
    exists = db.session.query(db.exists().where(
        User.username == username)).scalar()
    if not exists:
        return "username doesn't exists"
    if username & password == '':
        return 'unvalid username or password'
    valid_login = api.passhash.verify_password(username, password)
    return jsonify({'valid_login': valid_login})


if __name__ == '__main__':
    app.run(debug=True)
