from flask import Flask
from app.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import subprocess




app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app,db)

from app import routes,models

u = models.User(username='admin',password_hash='deadbeef',comments='This_is_not_the_flask_you_are_looking_for')
try:
    db.create_all()
    db.session.add(u)
    db.session.commit()
except:
    pass