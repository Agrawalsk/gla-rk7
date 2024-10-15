from flask_restful import Resource
from flask import request
from werkzeug.security import generate_password_hash
from root.db import mdb

class Register(Resource):
    def post(self):
        input_data = request.get_json()
        
        email = input_data.get("email")
        password = input_data.get("password")
        
        existing_user = mdb.users.find_one({"email": email})
        if existing_user:
            return {
                "status": 0,
                "cls": "danger",
                "msg": "Email already exists."
            }
                
        new_user = {
            "email": email,
            "password": password
        }
        
        result = mdb.users.insert_one(new_user)
        
        if result.inserted_id:
            return {
                "status": 1,
                "cls": "success",
                "msg": "User registered successfully!",
                "user_id": str(result.inserted_id)
            }
        else:
            return {
                "status": 0,
                "cls": "danger",
                "msg": "Registration failed. Please try again."
            }