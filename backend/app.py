from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔹 Configure the database URI from .env
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(30))

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    description = db.column(db.String(1000))
    date = db.column(db.String)
    time = db.column(db.Integer)
    is_done = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email:
        return jsonify({'message': 'Missing name or email'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    new_user = User(username=username, email=email, password = password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': f'User {username} added'}), 201


@app.route('/api/signin', methods = ['POST'])
def signin():

    data = request.get_json()

    if '@' in data.get('username'):

        email =  data.get('username')
        user = User.query.filter_by(email = email).first()
    else:

        username = data.get('username')
        user = User.query.filter_by(username = username).first()

    password = data.get('password')

    if user != password:
        
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'message': 'Login successful',
        'user_id': user.id,
        'username': user.username
    }), 200

    

@app.route('/api/addtodo', methods=['POST'])
def addtodo():
    pass

@app.route('/api/removetodo', methods=['POST'])
def removetodo():
    pass

# 🔹 Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
