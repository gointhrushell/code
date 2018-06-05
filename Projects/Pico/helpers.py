from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired,length

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(),length(max=32)])
    password = PasswordField('Password', validators=[DataRequired(),length(max=32)])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')
    
class CardForm(FlaskForm):
    title = StringField("Card Title",validators=[DataRequired(),length(max=32)])
    question = StringField("Question",validators=[DataRequired(),length(max=256)])
    answer = StringField("Answer",validators=[DataRequired(),length(max=256)])
    submit = SubmitField('Sign In')
    
class User():
    def __init__(self, name):
        self.name = name
        self.admin = self.is_admin()
    
    def is_admin(self):
        return self.name == 'Admin'
    
    def is_valid(self):
        return self.name == "Austin"