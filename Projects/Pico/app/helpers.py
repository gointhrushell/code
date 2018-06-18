from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired,length
from werkzeug.security import generate_password_hash,check_password_hash



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
    


    