from flask import Blueprint, jsonify, request
from .models import db, User
from .passhash import generate_password, verify_password
from flask_cors import CORS
import requests

routes = Blueprint('routes', __name__)
CORS(routes)


def get_key(username):
    user = User.query.filter_by(username=username).first()
    return user.key


def delete_user(username):
    user = User.query.filter_by(username=username).first()
    db.session.delete(user)
    db.session.commit()


@routes.route('/register', methods=['POST'])
def new_user():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']

    exists = db.session.query(db.exists().where(
        User.username == username)).scalar()

    if exists:
        return jsonify({'msg': 'Username already exists.'})
    elif username == '' and password == '':
        return jsonify({'msg': 'Invalid username and password.'})
    elif username == '':
        return jsonify({'msg': 'Invalid username.'})
    elif password == '':
        return jsonify({'msg': 'Invalid password.'})

    else:
        password_tuple = generate_password(password)
        password_hash = password_tuple[0]
        password_salt = password_tuple[1]

        user = User(username=username, password_hash=password_hash,
                    password_salt=password_salt)
        db.session.add(user)
        db.session.commit()

        return jsonify({'msg': 'success'})


@routes.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']

    exists = db.session.query(db.exists().where(
        User.username == username)).scalar()
    if not exists:
        return jsonify({'msg': "username doesn't exists"})
    elif username == '' and password == '':
        return jsonify({'msg': 'Invalid username and password'})
    elif username == '':
        return jsonify({'msg': 'Invalid username.'})
    elif password == '':
        return jsonify({'msg': 'Invalid password.'})

    else:
        valid_login = verify_password(username, password)
        if(valid_login == True):
            key = get_key(username)
            return jsonify({'valid_login': valid_login, 'key': key})
        else:
            return jsonify({'valid_login': valid_login})


@routes.route('/generate_key', methods=['POST'])
def generate_key():
    request_data = request.get_json()
    username = request_data['username']
    gateway_address = request_data['address']

    params = {"devicetype": 'beebulb-'+username}

    try:
        r = requests.post(f'http://{gateway_address}/api', json=params)
        if(r.status_code == 200):
            data = r.json()
            answer = data[0]
            user = User.query.filter_by(username=username).first()
            user.key = answer['success'].get("username")
            db.session.commit()
            return jsonify({'msg': user.key})
        else:
            delete_user(username)
            return jsonify({'msg': 'Gateway is locked'})
    except requests.exceptions.RequestException as e:
        print(e)
