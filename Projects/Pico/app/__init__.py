from flask import Flask
from app.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
#import subprocess




app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
login = LoginManager(app)
login.login_view = 'login'
bootstrap=Bootstrap(app)

from app import routes,models


try:
    db.drop_all()
    u = models.User(username='admin',password_hash='deadbeef',admin=1,comments='This_is_not_the_flask_you_are_looking_for')
    c = models.Card(question='What is 2 + 2 -1?',answer="Quick maths",user_id=1)
    db.create_all()
    db.session.add(u)
    db.session.add(c)
    db.session.commit()
except:
    
    pass