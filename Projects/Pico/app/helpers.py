from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired,length,EqualTo,ValidationError
from werkzeug.security import generate_password_hash,check_password_hash
from app.models import User



class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(),length(max=32)])
    password = PasswordField('Password', validators=[DataRequired(),length(max=32)])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')
    
class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(),length(min=1,max=32)])
    password = PasswordField('Password', validators=[DataRequired(),length(min=1, max=32)])
    password2 = PasswordField('Confirm Password', validators=[DataRequired(),EqualTo('password'),length(max=32)])
    submit= SubmitField('Register')
    
    def validate_username(self,username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError("Please pick a different username")
        
    
    
class CardForm(FlaskForm):
    #title = StringField("Card Title",validators=[DataRequired(),length(max=32)])
    question = StringField("Question",validators=[DataRequired(),length(max=256)])
    answer = StringField("Answer",validators=[DataRequired(),length(max=256)])
    submit = SubmitField('Create')
    


    