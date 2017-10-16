import os
import random
from flask import Flask, session, redirect, url_for, request, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = '7h15_5h0uld_b3_r34lly_53cur3d'
@app.route('/')
def index():
    # the "answer" value cannot be stored in the user session as done below
    # since the session is sent to the client in a cookie that is not encrypted!
    session['golem'] = '{{ config.items() }}'
    return redirect('/lost')


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)