from flask import Flask, request, jsonify
from flask_restful import Resource
from root.db import mdb
import random
import smtplib
from root.general.commonUtilis import bcryptPasswordHash  # Import the bcryptPasswordHash function

class ForgotPassword(Resource):
    def post(self):
        email = request.json.get('email', '')
        if not email:
            return {"message": "Email is required."}, 400
        
        otp = random.randint(100000, 999999)

        # Store OTP in the database
        user = mdb.users.find_one({"email": email})
        if not user:
            return {"status": 0, "message": "Email not found."}, 404
        
        # Save the OTP to the user document
        mdb.users.update_one({"email": email}, {"$set": {"otp": otp}})
        
        send_email(email, otp)  # Send email with OTP
        return {"status": 1, "message": "OTP sent to the provided email."}, 200

def send_email(recipient, otp):
    try:
        sender_email = "skshi1604@gmail.com"
        sender_password = "zwyv wdmy wixb khas"  # Use environment variables for security
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        
        subject = "Your OTP for Password Reset"
        body = f"Your OTP for password reset is: {otp}"
        message = f"Subject: {subject}\n\n{body}"

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        
        server.sendmail(sender_email, recipient, message)
        server.quit()

        print(f"OTP {otp} sent to {recipient}")
    except Exception as e:
        print(f"Failed to send email: {e}")

class VerifyEmail(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        otp = data.get('verificationCode')

        user = mdb.users.find_one({"email": email})
        if not user:
            return {'status': 0, 'msg': 'Email not found'}, 404

        if user.get('otp') != int(otp):
            return {'status': 0, 'msg': 'Invalid OTP'}, 400

        return {'status': 1, 'msg': 'OTP verified'}, 200

class ResetPassword(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        otp = data.get('verificationCode')
        new_password = data.get('newPassword')

        user = mdb.users.find_one({"email": email})
        if not user:
            return {'status': 0, 'msg': 'Email not found'}, 404

        if user.get('otp') != int(otp):
            return {'status': 0, 'msg': 'Invalid OTP'}, 400
        
        # Hash the new password using the bcryptPasswordHash function
        hashed_password = bcryptPasswordHash(new_password)

        # Update the password and clear the OTP
        mdb.users.update_one(
            {"email": email}, 
            {"$set": {"password": hashed_password, "otp": None}}
        )
        
        return {'status': 1, 'msg': 'Password reset successful'}, 200
