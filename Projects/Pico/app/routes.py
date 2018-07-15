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
    return render_template('404.html',title='File Not Found')


@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html",title="Home")

@app.route('/admin',methods=['GET'])
@login_required
def admin():
    if current_user.is_authenticated:
        if current_user.admin:
            if current_user.id == 1:
                user_list=User.query.filter(User.id!=1)
                if user_list.first() is None:
                    user_list=None
                return render_template("admin.html",title="Admin",flag="THIS_IS_FLAG_2",user_list=user_list)
            else:
                return render_template("admin.html",title="Denied",flag="Not yo flag")
        else:
            return redirect(url_for('denied'))
    return redirect(url_for('index'))

@app.route('/denied',methods=['GET'])
def denied():
    return render_template('denied.html',title='Denied')
 
@app.route('/login',methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        try:
            template = '''{% extends "base.html" %}
                {% block app_content %}
                <h1 class="page-header">Oops!</h1>
                <p>You're already logged in '''+ str(current_user.username)+'''!<br>
                Want to see your 
                <a href="{{ url_for('list_cards') }}">flaskcards</a>?</p>
                {% endblock %}'''  
            return render_template_string(template,title='Login')
        except:
            template = '''{% extends "base.html" %}
                {% block app_content %}
                <h1 class="page-header">Oops!</h1>
                <p>You're already logged in but something is wrong with your name...<br>
                Want to see your 
                <a href="{{ url_for('list_cards') }}">flaskcards</a>?</p>
                {% endblock %}''' 
            return render_template_string(template,title='Login')
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
    if form.validate_on_submit():
        card = Card(question=form.question.data,answer=form.answer.data,user_id=current_user.id)
        db.session.add(card)
        db.session.commit()
        flash("Card created")
        return redirect(url_for("create_card")) #("create.html",title="Create",form=form)
    return render_template("create.html",title="Create",form=form)


@app.route('/list_cards',methods=['GET'])
@login_required
def list_cards():
    card_list=Card.query.filter_by(user_id=current_user.id)
    if card_list.first() is None:
        card_list=None    
    return render_template("list.html",title="List",cards=card_list)

@app.route('/logout',methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/delete_card/<card_id>',methods=['POST'])
@login_required
def delete_card(card_id):
    record = Card.query.filter_by(id=card_id)
    result = record.first()
    if result is not None and current_user.id == result.user_id:
        record.delete()
        db.session.commit()
        flash("Deleted card")
    return redirect(url_for('list_cards'))

@app.route('/update_comment/<user_id>',methods=['POST'])
@login_required
def update_comment(user_id):
    try:
        int(user_id)
        record = User.query.filter_by(id=user_id)
        result = record.first()
        if len(request.form.get('comment')) > 128:
            flash("Comment too long")
        
        elif result is not None:
            try:
                db.engine.execute("update User set comment = '"+request.form.get('comment')+"' where id="+str(user_id)+";")
                flash("Comment updated")
            except:
                flash("Something went wrong with the sqlite update")
        return redirect(url_for("admin"))
    except Exception as e:
        return redirect(url_for("admin"))


########### TODO ###########
# Change inject point to /index
# Add username to navbar
# Add table headers to the View/Update Comments

