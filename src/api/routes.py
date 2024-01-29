"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Administradores
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import re
import bcrypt

def check(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    # pass the regular expression
    # and the string into the fullmatch() method
    if(re.fullmatch(regex, email)):
        return True
    else:
        return False

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register_user():
    body = request.get_json()
    name = body.get('name', None)
    email = body.get('email', None)
    password = body.get('password', None)
    if name is None or email is None or password is None:
        return {'message': 'Missing arguments'}      
    bpassword = bytes(password, 'utf-8')
    salt = bcrypt.gensalt(14)
    hashed_password = bcrypt.hashpw(password=bpassword, salt=salt)       
    user = User(name, email,hashed_password.decode('utf-8'))    
    #return {'message': f'name: {user.name} email: {user.email} password: {password}'}
    db.session.add(user)
    db.session.commit()
    return {'message': f'User {user.email} was created'}




@api.route('/admin', methods=['GET'])

def get_admins():
    try:
        # Extract email from the admin token
        # email = get_jwt_identity()
        # if not email:
        #     return {'message': 'Invalid token'}, 401

        # # Check if the user is an admin
        # admin = Administradores.query.filter_by(email=email).first()
        # if not admin:
            # return {'message': 'Admin user not found'}, 401

        # Fetch the list of administrators
        admins = Administradores.query.all()
        admins_data = [admin.serialize() for admin in admins]
        return jsonify(admins_data), 200
    except Exception as e:
        print(f"Error in get_admins: {str(e)}")
        return {'message': 'Internal Server Error'}, 500
    





@api.route('/admin/register', methods=['POST'])
def register_admin():
    body = request.get_json()
    name = body.get('name', None)
    email = body.get('email', None)
    password = body.get('password', None)
    if name is None or email is None or password is None:
        return {'message': 'Missing arguments'}      
    bpassword = bytes(password, 'utf-8')
    salt = bcrypt.gensalt(14)
    hashed_password = bcrypt.hashpw(password=bpassword, salt=salt)       
    user = Administradores(name, email,hashed_password.decode('utf-8'))    
    #return {'message': f'name: {user.name} email: {user.email} password: {password}'}
    db.session.add(user)
    db.session.commit()
    return {'message': f'User {user.email} was created'}




@api.route('/token', methods=['POST'])
def create_token():
    body = request.get_json()
    email = body.get('email', None)
    password = body.get('password', None)
    if password is None or email is None:
        return {'message': f'missing parameters {email} {password}', 'authorize': False}, 400
    if check(email) is not True:
        return {'message': 'email is not valid', 'authorize': False}, 400
    user = User.query.filter_by(email=email).one_or_none()    
    if user is None:
        return {'mesasge': 'User doesnt exist', 'authorize': False}, 400
    password_byte =bytes(password, 'utf-8')
    if bcrypt.checkpw(password_byte, user.password.encode('utf-8')):
        return {'token': create_access_token(identity = email), 'authorize': True},200
    return {'message': 'Unauthorized', 'authorize': False}, 401



@api.route('/admin/token', methods=['POST'])
def create_Admintoken():
    body = request.get_json()
    email = body.get('email', None)
    password = body.get('password', None)
    if password is None or email is None:
        return {'message': f'missing parameters {email} {password}', 'authorize': False}, 400
    if check(email) is not True:
        return {'message': 'email is not valid', 'authorize': False}, 400
    user = Administradores.query.filter_by(email=email).one_or_none()    
    if user is None:
        return {'message': 'User doesnt exist', 'authorize': False}, 400
    password_byte = bytes(password, 'utf-8')
    if bcrypt.checkpw(password_byte, user.password.encode('utf-8')):
        return {'tokenAdmin': create_access_token(identity=email), 'authorize': True}, 200
    return {'message': 'Unauthorized', 'authorize': False}, 401




@api.route('/admin/profile/user')
@jwt_required()
def validate_Adminuser():
    try:
        # Extract email from the admin token
        email = get_jwt_identity()
        if not email:
            return {'message': 'Invalid token'}, 401

        # Check if the admin user exists
        user = Administradores.query.filter_by(email=email).first()
        if not user:
            return {'message': 'Admin user not found'}, 401

        # Return serialized user information
        return user.serialize(), 200
    except Exception as e:
        print(f"Error in validate_Adminuser: {str(e)}")
        return {'message': 'Internal Server Error'}, 500

@api.route('/admin/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    try:
        # Retrieve the admin from the database by its ID
        admin = Administradores.query.get(admin_id)

        # Check if the admin with the given ID exists
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        # Delete the admin from the database
        db.session.delete(admin)
        db.session.commit()

        # Return a success message in the response
        response_body = {
            "msg": f"DELETE /admin/{admin_id} response",
            "data": {"status": "success", "message": f"Admin with ID {admin_id} deleted successfully"}
        }
        return jsonify(response_body), 200

    except Exception as e:
        print(f"Error in delete_admin: {str(e)}")
        return {'message': 'Internal Server Error'}, 500

       




@api.route('/profile/user')
@jwt_required()
def validate_user():
    email = get_jwt_identity()    
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return {'message': 'Unauthorized'}, 401
    return user.serialize(), 200
    
    

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200