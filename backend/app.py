from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime

from models import db, User, Todo

from dotenv import load_dotenv
import os
from functools import wraps


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
    
    hashedPassword = generate_password_hash(password)

    new_user = User(username=username, email=email, password = hashedPassword)
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

    if user and check_password_hash(user.password, password):

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
    else:

        return jsonify({"message":"Invalid credentials"}),401
    
    

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

def token_required(f):

    @wraps(f)

    def decorated(*args, **kwargs):

        auth_header = request.headers.get('Authorization')
        if not auth_header:

            return jsonify({'message': 'Authorization header missing'}), 401
        try:

            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = decoded['user_id']
        except (IndexError, jwt.ExpiredSignatureError, jwt.InvalidTokenError):

            return jsonify({'message': 'Invalid or expired token'}), 401
        return f(user_id, *args, **kwargs)
    return decorated

@app.route('/api/addtodo', methods=['POST'])
@token_required
def addtodo(user_id):

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

@app.route('/api/<int:todo_id>/gettodo', methods = ['GET'])
@token_required
def gettodo(user_id, todo_id):


    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()

    if not user_id:
        
        return jsonify({"message": "Unauthorized"}), 401
        
    return jsonify({

        'title': todo.title,
        'description': todo.description,
        'date': todo.date,
        'time': todo.time,
        'is_done': todo.is_done
    })

    return jsonify(todo), 200


@app.route('/api/gettodolist/', methods=['GET'])
@token_required
def gettodolist(user_id):

    todos = Todo.query.filter_by(user_id=user_id).all()

    todo_list = [{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'date': t.date,
        'time': t.time,
        'is_done': t.is_done
    } for t in todos]

    return jsonify(todo_list), 200

@app.route('/api/<int:todo_id>/updatetodo', methods=['PUT'])
@token_required
def updatetodo(user_id, todo_id):

    if not user_id:

        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()

    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:

        return jsonify({"message": "Todo not found"}), 404

    todo.title = data.get("title", todo.title)
    todo.description = data.get("description", todo.description)
    todo.date = data.get("date", todo.date)
    todo.time = data.get("time", todo.time)
    todo.is_done = data.get("is_done", todo.is_done)

    db.session.commit()

    return jsonify({"message": "Todo updated successfully"}), 200


@app.route('/api/<int:todo_id>/toggle_done', methods=['POST'])
@token_required
def toggle_done(user_id, todo_id):  

    if not user_id:

        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    is_done = data.get('is_done')

    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({"message": "Todo not found or unauthorized"}), 404

    todo.is_done = is_done
    db.session.commit()

    return jsonify({
        "id": todo.id,
        "is_done": todo.is_done,
        "message": "Todo updated successfully"
    }), 200

@app.route('/api/<int:todo_id>/deletetodo', methods=['DELETE'])
@token_required
def deletetodo(user_id, todo_id):

    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:

        return jsonify({'message': 'Todo not found or not yours'}), 404

    db.session.delete(todo)
    db.session.commit()

    return jsonify({'message': 'Todo deleted successfully'}), 200

# 🔹 Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
