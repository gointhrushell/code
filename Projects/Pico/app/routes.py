from flask import render_template,flash
from app import app,helpers
#import helpers
session = None
@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html",user=session)

@app.route('/admin',methods=['GET'])
def admin():
    if session:
        if session['admin']:
            return render_template("admin.html",title="Admin",user=session,flag="THIS IS A FLAG")
        else:
            return render_template("admin.html",title="Denied",user=session,flag="Not yo flag")
    else:
        return render_template("admin.html",title="Denied",user=session,flag="Not yo flag")
    
@app.route('/register',methods=['GET','POST'])
def register():
    form = helpers.LoginForm()
    
    if form.validate_on_submit():
        myUser = helpers.User(form.username.data)
        if myUser.is_valid():
            session['name'] = myUser.name
            session['admin'] = myUser.admin
            return redirect('/index')
        else:
            flash("Invalid user/password")
    return render_template('register.html', title='Sign In', form=form)


@app.route('/create_card',methods=['GET','POST'])
def create_card():
    form = helpers.CardForm()
    if form.validate_on_submit():
        render_template("create.html",title="Create",form=form,user=session)
    else:
        flash("Something went wrong")
    return render_template("create.html",title="Create",form=form,user=session)

@app.route('/delete_card',methods=['GET'])
def delete_card():
    return render_template("dashboard.html",title="Delete",user=session)

@app.route('/list_cards',methods=['GET'])
def list_cards():
    card=[{"title":"Card1","question":"This would be a question","answer":"answer here"},{"title":"Card2","question":"question2","answer":"answer2"}]
    return render_template("list.html",title="List",cards=card,user=session)

@app.route('/logout',methods=['GET'])
def logout():
    session.clear()
    return redirect('/index')

    
if __name__ == '__main__':
    app.run(host='0.0.0.0')