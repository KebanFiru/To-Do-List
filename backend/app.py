from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import jwt, datetime

from models import db, User, Todo

from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔹 Configure the database URI from .env
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_KEY = os.getenv("REFRESH_KEY")

db.init_app(app)

@app.before_first_request
def create_tables():
    db.drop_all()
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
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 409

    new_user = User(username=username, email=email, password = password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': f'User {username} added'}), 201


@app.route('/api/signin', methods = ['POST'])
def signin():

    data = request.get_json()
    username = data.get('username')

    if '@' in username:

        user = User.query.filter_by(email = username).first()
    else:

        user = User.query.filter_by(username = username).first()

    password = data.get('password')

    if user.password != password:
        
        return jsonify({'message': 'User not found'}), 404
    
    token = jwt.encode({
        'user_id' : user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')

    refresh_token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)
    }, REFRESH_KEY, algorithm='HS256')

    response = jsonify({'access_token': token})
    response.set_cookie('refresh_token', refresh_token, httponly=True,samesite='Strict', secure=False)

    return response

@app.route('/api/refresh', methods=['POST'])
def refresh_token():

    refresh_token = request.cookies.get('refresh_token')

    if not refresh_token:

        return jsonify({'message': 'Refresh token missing'}), 401
    try:

        data = jwt.decode(refresh_token, REFRESH_KEY, algorithms=['HS256'])
        new_access_token = jwt.encode({
            'user_id': data['user_id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({'access_token': new_access_token}), 200

    except jwt.ExpiredSignatureError:
    
        return jsonify({'message': 'Refresh token expired'}), 401
    except jwt.InvalidTokenError:

        return jsonify({'message': 'Invalid refresh token'}), 401



@app.route('/api/addtodo', methods=['POST'])
def addtodo():
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({'message': 'Authorization header missing'}), 401

    try:
        # Expected format: Bearer <token>
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = decoded['user_id']
    except (IndexError, jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({'message': 'Invalid or expired token'}), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    date = data.get('date')
    time = data.get('time')
    is_done = data.get('is_done', False)

    # Create new Todo for this user
    new_todo = Todo(
        title=title,
        description=description,
        date=date,
        time=time,
        is_done=is_done,
        user_id=user_id
    )
    db.session.add(new_todo)
    db.session.commit()

    return jsonify({'message': 'Todo created successfully'}), 200


@app.route('/api/removetodo', methods=['POST'])
def removetodo():
    pass

# 🔹 Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
