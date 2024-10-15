from flask_restful import Resource
from flask import request
from flask_jwt_extended import create_access_token
from root.db import mdb
import bcrypt  # Make sure to install bcrypt with pip install bcrypt

class Login(Resource):
    def post(self):
        '''
        - Given email and password not exists
        - Given email exists but status is not active
        - Given email and password is not correct
        - Both are correct -> return success message

        - email
        - password
        '''
        input_data = request.get_json()

        # Check if email and password are provided
        email = input_data.get("email")
        password = input_data.get("password")

        if not email or not password:
            return {
                "status": 0,
                "cls": "danger",
                "msg": "Email and password are required."
            }

        # Find user in the database
        user = mdb.users.find_one({"email": email})
        
        # Case 1: Email not found
        if not user:
            return {
                "status": 0,
                "cls": "danger",
                "msg": "Email not found."
            }

        # Check if account is active
        if user.get("status") != 1:
            return {
                "status": 0,
                "cls": "danger",
                "msg": "Account is not active."
            }

        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.get("password").encode('utf-8')):
            return {
                "status": 0,
                "cls": "danger",
                "msg": "Incorrect password."
            }

        # Case 4: Both email and password are correct -> Return success message
        access_token = create_access_token(identity=email)
        return {
            "status": 1,
            "cls": "success",
            "msg": "Login successful!",
            "payload": {
                "input": input_data,
                "user": {
                    "email": user["email"],
                    "username": user.get("username")
                },
                "token": access_token
            }
        }
