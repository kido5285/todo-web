from flask import Flask, render_template, session, redirect
from functools import wraps
from users.models import User, db
import pymongo
app = Flask(__name__)
app.secret_key = b'\hlk^\qai\pol\r09|\qh3E\x13\xa7\yu8J0\xac8\xc5'

#routes
@app.route('/user/submitsignup/', methods=['POST'])
def submitsignup():
  return User().submitsignup()

@app.route('/user/signout/', methods=['POST'])
def signout():
  return User().signout()

@app.route('/user/submitlogin/', methods=['POST'])
def submitlogin():
  return User().submitlogin()

@app.route('/user/additem/', methods=['POST'])
def additem():
    return User().addItem()

@app.route('/user/deleteitem/', methods=['POST'])
def deleteitem():
    return User().deleteItem()

@app.route('/user/completeitem/', methods=['POST'])
def completeitem():
    return User().completeItem()

@app.route('/user/uncompleteitem/', methods=['POST'])
def uncompleteitem():
    return User().uncompleteItem()

def login_required(f):
  @wraps(f)
  def wrap(*args, **kwargs):
    if 'logged_in' in session:
      return f(*args, **kwargs)
    else:
      return redirect('/')
  
  return wrap

#app routes
@app.route('/')
def home():
    if 'logged_in' in session:
        return redirect('/dashboard')
    else:
        return redirect('/login')

@app.route('/login')
def login():
    if 'logged_in' not in session:
        return render_template('login.html')
    else: 
        return redirect('/')

@app.route('/signup/')
def signup():
    if 'logged_in' not in session:
        return render_template('signup.html')
    else: 
        return redirect('/')
        

@app.route('/dashboard/')
@login_required
def dashboard():
    if 'logged_in' in session:
        fUser = db.users.find_one({'username': session['user']['username']})
        return render_template('dashboard.html', completed=fUser['todos']['completed'], uncompleted=fUser['todos']['uncompleted'])
    else:
        return redirect('/login')

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')
