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

if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=5000)
