import hashlib
import os
from .models import User


def generate_password(password):
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    hash_salt_pair = [key, salt]
    return hash_salt_pair


def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        user.password_salt,
        100000
    )

    return password_hash == user.password_hash
