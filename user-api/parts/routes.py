from flask import Blueprint, jsonify, request
from .models import db, User, Preset
from .passhash import generate_password, verify_password
from flask_cors import CORS
import requests
import json

routes = Blueprint('routes', __name__)
CORS(routes)


def get_key(username):
    user = User.query.filter_by(username=username).first()
    return user.key


def delete_user(username):
    user = User.query.filter_by(username=username).first()
    db.session.delete(user)
    db.session.commit()


def check_if_exists(username):
    return db.session.query(db.exists().where(
        User.username == username)).scalar()


@routes.route('/register', methods=['POST'])
def new_user():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']

    exists = check_if_exists(username)

    if exists:
        return jsonify({'msg': 'Username already exists.'})
    elif username == '' or password == '':
        return jsonify({'msg': 'Invalid username or password.'})

    else:
        password_pair = generate_password(password)

        user = User(username=username, password_hash=password_pair[0],
                    password_salt=password_pair[1])
        db.session.add(user)
        db.session.commit()

        return jsonify({'msg': 'success'})


@routes.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']

    exists = check_if_exists(username)

    if not exists:
        return jsonify({'msg': "User doesn't exist."})
    elif username == '' or password == '':
        return jsonify({'msg': 'Invalid username or password.'})

    else:
        valid_login = verify_password(username, password)
        if(valid_login):
            key = get_key(username)
            return jsonify({'msg': valid_login, 'key': key})
        else:
            return jsonify({"msg": "Wrong password"})


@routes.route('/auto_login', methods=['GET'])
def auto_login():
    user = User.query.filter_by(username='vsvirins').first()
    return jsonify({"enabled": True, "key": user.key, "username": user.username})


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


@routes.route('/store_preset', methods=['POST'])
def store_preset():
    request_data = request.get_json()
    preset = request_data['preset']
    username = request_data['username']
    preset_id = request_data['id']

    new_preset = Preset(id=preset_id, preset=preset, owner=username)
    db.session.add(new_preset)
    db.session.commit()

    return jsonify({'msg': 'success'})


@routes.route('/delete_preset/<preset_id>', methods=['DELETE'])
def delete_preset(preset_id):
    Preset.query.filter_by(id=preset_id).delete()
    db.session.commit()

    return jsonify({f'msg': 'preset {preset_id} deleted'})


@routes.route('/get_presets', methods=['POST'])
def get_presets():
    request_data = request.get_json()
    username = request_data['username']
    presets = db.session.query(Preset).filter_by(owner=username).all()

    presets_collection = {}
    count = 0
    for preset in presets:
        presets_collection[count] = preset.preset
        count += 1

    return jsonify(presets_collection)
