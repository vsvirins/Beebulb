from flask import Flask, request, jsonify
import os

from api.passhash import generate_password, verify_password
from api.models import *


app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////' + \
    os.path.join(basedir, '/api/db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
ma.init_app(app)

from api.routes import routes  # noqa
app.register_blueprint(routes)


if __name__ == '__main__':
    app.run(debug=True)
