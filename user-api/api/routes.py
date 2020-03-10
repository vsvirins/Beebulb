from flask import Blueprint, jsonify
from .models import User, db
from .passhash import generate_password, verify_password

routes = Blueprint('routes', __name__)


@routes.route('/register', methods=['POST'])
def new_user(username, password):
    exists = db.session.query(db.exists().where(
        User.username == username)).scalar()
    if exists:
        return 'username already exists'
    if username or password == '':
        return 'unvalid username or password'

    password_tuple = generate_password(password)
    password_hash = password_tuple[0]
    password_salt = password_tuple[1]

    user = User(username=username, password_hash=password_hash,
                password_salt=password_salt)
    db.session.add(user)

    return jsonify({'msg': f'Welcome {username}.'})


@routes.route('/login', methods=['GET'])
def login(username, password):
    exists = db.session.query(db.exists().where(
        User.username == username)).scalar()
    if not exists:
        return "username doesn't exists"
    if username or password == '':
        return 'unvalid username or password'
    valid_login = verify_password(username, password)
    return jsonify({'valid_login': valid_login})


@routes.route('/')
def hello_world():
    return jsonify({'msg': 'hello world'})
