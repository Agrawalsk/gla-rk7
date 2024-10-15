from flask import request
from flask_jwt_extended import create_access_token
from flask_restful import Resource
from root.db import mdb
from root.general.commonUtilis import (
    bcryptPasswordHash,
    cleanupEmail,
    maskEmail,
    mdbObjectIdToStr,
    verifyPassword,
)
from root.general.authUtils import validate_auth
from root.static import G_ACCESS_EXPIRES

class Login(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        userMeta = {
            "email": email,
            "password": password,
        }

        return login(userMeta, {})

def login(data, filter, isRedirect=True):
    email = cleanupEmail(data.get("email"))

    filter = {"email": email, "status": {"$nin": ["deleted", "removed", "suspended"]}}

    userDoc = mdb.users.find_one(filter)

    if not userDoc or "_id" not in userDoc:
        return {
            "status": 0,
            "cls": "error",
            "msg": "Invalid email or password. Please try again.",
        }

    password = data.get("password")
    if not verifyPassword(userDoc["password"], password):
        return {
            "status": 0,
            "cls": "error",
            "msg": "Invalid email or password. Please try again.",
        }

    uid = mdbObjectIdToStr(userDoc["_id"])
    full_name = userDoc.get("fullName", "User")

    access_token = create_access_token(identity=uid, expires_delta=G_ACCESS_EXPIRES)
    
    payload = {
        "accessToken": access_token,
        "uid": uid,
        "fullName": full_name,
        "redirectUrl": "/dashboard",
    }

    return {
        "status": 1,
        "cls": "success",
        "msg": "Login successful! Redirecting...",
        "payload": payload,
    }

class UserRegister(Resource):
    @validate_auth(optional=True)
    def post(self, suid, suser):
        input = request.get_json()

        full_name = input.get("fullName")
        email = cleanupEmail(input.get("email"))
        password = input.get("password")

        if mdb.users.find_one({"email": email}):
            maskedEmail = maskEmail(email)
            return {
                "status": 0,
                "cls": "error",
                "msg": f"Email ID ({maskedEmail}) already exists.",
                "payload": {},
            }

        hashed_password = bcryptPasswordHash(password)

        new_user = {
            "fullName": full_name,
            "email": email,
            "password": hashed_password,
            "status": "active",
            "avatarUrl": input.get("avatarUrl", "/avatar.svg"),
        }

        mdb.users.insert_one(new_user)

        payload = {
            "ruid": new_user["_id"],
            "redirect": "/login",
        }

        return {
            "status": 1,
            "cls": "success",
            "msg": "Registration successful! Please login to continue.",
            "payload": payload,
        }

class ForgetPassword(Resource):
    @validate_auth(optional=True)
    def post(self, suid, suser):
        input = request.get_json()
        email = input.get("email")
        
        user = mdb.users.find_one({"email": email})

        if not user or "_id" not in user:
            return {
                "status": 0,
                "cls": "error",
                "msg": "User not found.",
                "payload": {},
            }

        new_password = bcryptPasswordHash(input.get("newPassword"))
        mdb.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": new_password, "defaultPassword": False}},
        )

        return {
            "status": 1,
            "cls": "success",
            "msg": "Password reset successfully!",
            "payload": {},
        }

class UserLogout(Resource):
    @validate_auth(optional=True)
    def post(self, suid, suser):
        # Implement logout logic
        return {
            "status": 1,
            "cls": "success",
            "msg": "Logged out successfully.",
        }

def logLoginSessions(uid, user, isLoggedIn=False, tokens=None, extra={}):
    # Log login session details if required
    return {
        "status": 1,
        "cls": "success",
        "msg": "Success",
    }
