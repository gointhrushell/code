if __name__ == '__main__':
    print("Please use run.py")
    exit()
    
from flask import render_template,flash,request,redirect,url_for,render_template_string,abort
from flask_login import current_user,login_user,logout_user,login_required
from app import app,helpers,db
from app.models import User,Card
from werkzeug.urls import url_parse


@app.errorhandler(404)
def not_found_error(error):
    try:
        template = '''{% extends "base.html" %}
        {% block content %}
        <h1>File Not Found</h1>
        <p>Sorry '''+("Anonymous User" if not current_user.is_authenticated else str(current_user.username))+'''...
        <a href="{{ url_for('index') }}">return home</a>?</p>
        {% endblock %}'''
        return render_template_string(template,title="404")
    except Exception:
        template = '''{% extends "base.html" %}
        {% block content %}
        <h1>File Not Found</h1>
        <p>Sorry we can't find that file and something is wrong with your name</p>
        <p><a href="{{ url_for('index') }}">return home</a>?</p>
        {% endblock %}'''
        return render_template_string(template,title="404")
    

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html",title="Home")

@app.route('/admin',methods=['GET'])
@login_required
def admin():
    if current_user.is_authenticated:
        form = helpers.CommentForm()
        if current_user.admin:
            return render_template("admin.html",title="Admin",flag="THIS IS A FLAG",user_list=User.query.filter(User.id!=1))
        return render_template("admin.html",title="Denied",flag="Not yo flag",form=form)
    return redirect(url_for('index'))
    
@app.route('/login',methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = helpers.LoginForm()
    if form.validate_on_submit():
        user=User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash("Invalid username or password")
            return redirect(url_for('login'))
        login_user(user,remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html',title='Sign In',form=form)
    
@app.route('/register',methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = helpers.RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Successfully registered")
        return redirect(url_for("login"))
    return render_template('register.html',title="Register",form=form)
    


@app.route('/create_card',methods=['GET','POST'])
@login_required
def create_card():
    form = helpers.CardForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            card = Card(question=form.question.data,answer=form.answer.data,user_id=current_user.id)
            db.session.add(card)
            db.session.commit()
            flash("Card created")
            return render_template("create.html",title="Create",form=form)
        else:
            flash("Something went wrong")
    return render_template("create.html",title="Create",form=form)


@app.route('/list_cards',methods=['GET'])
@login_required
def list_cards():
    return render_template("list.html",title="List",cards=Card.query.filter_by(user_id=current_user.id))

@app.route('/logout',methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/delete_card/<card_id>',methods=['GET'])
@login_required
def delete_card(card_id):
    record = Card.query.filter_by(id=card_id)
    result = record.first()
    if result is not None and current_user.id == result.user_id:
        record.delete()
        db.session.commit()
        flash("Deleted card")
    return redirect(url_for('list_cards'))

###################### TODO ####################
# Beautify the site
# Stop using the 404 for the inject

@app.route('/update_comment',methods=['GET'])
@login_required
def update_comment():
    return redirect(url_for("admin"))
    
