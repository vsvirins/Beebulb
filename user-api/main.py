from flask import Flask
import os
from parts.models import db
from parts.routes import routes


app = Flask(__name__)
app.register_blueprint(routes)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////' + \
    os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.app = app
db.init_app(app)
db.create_all()
db.session.commit()


# def add_admin():
#     with app.app_context():
#         admin = User(username='admin', password_hash=b"\x10\x8d\xfcV\x82\x8b\x08Q\x96\x1fp\x97\x1e\x94\xd8C( F\x8f\x80'\xb9\x89\xff\x8er;\x89\xb4\xbef",
#                      password_salt=b'\xde\x1d\xc9\xb8\xdf\x0f\xac4\xee\x99\xa4M?W\x9b\x90R\xbeA=\x0eY\xf3/\xb6\xb6\x05\xb9\xaf\xebq ')
#         db.session.add(admin)
#         db.session.commit()


# add_admin()

if __name__ == '__main__':
    app.run(debug=True)
