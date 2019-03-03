from flask import Flask
from app.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bootstrap import Bootstrap


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
login = LoginManager(app)
login.login_view = 'login'
bootstrap=Bootstrap(app)

from app import routes,models


try:
    db.drop_all()
    db.create_all()
    db.cursor().execute("PRAGMA journal_mode = MEMORY")
    db.commit()    
    
    u = models.User(username='admin',password_hash='deadbeef',id=1,admin=1,comment='Administrator')    
    db.session.add(u)
    
    u = models.User(username='Linda',password_hash='deadbeef',id=2,admin=0,comment='Know it all.')    
    db.session.add(u)    
    
    u = models.User(username='Jake',password_hash='deadbeef',id=3,admin=0,comment='Works at StateFarm')    
    db.session.add(u)    
    
    #Debug purposes
    #u = models.User(username='austin',admin=1,id=1,comment='Debug everything')    
    #u.set_password('test')
    #db.session.add(u)    
    
    c = models.Card(question='What is 2 + 2 -1?',answer="Quick maths",user_id=1)
    db.session.add(c)
    
    c = models.Card(question='What is life?',answer="42",user_id=2)
    db.session.add(c)
    
    c = models.Card(question='Like a good neighbor ____ _____ ____ ____',answer="Get off my lawn",user_id=3)
    db.session.add(c)   
    
    
    db.session.commit()
    
except:
    
    pass