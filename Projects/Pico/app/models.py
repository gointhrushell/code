from app import db

class User(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64),index=True,unique=True)
    password_hash = db.Column(db.String(128))
    comments = db.Column(db.String(128))
    
    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    '''def __init__(self, name):
        self.name = name
        self.admin = self.is_admin()

    def set_password(self,password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self,password):
        return check_password_hash(self.password_hash,password)'''

class Card(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    question = db.Column(db.String(256))
    answer = db.Column(db.String(256))
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    
    def __repr__(self):
        return '<Card {}>'.format(self.id)
    
