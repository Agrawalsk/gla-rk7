import os
from flask import request, jsonify, send_file
from flask_restful import Resource
from openpyxl.packaging.manifest import mimetypes
from werkzeug.utils import secure_filename
from flask import Response, make_response
from bson import ObjectId
from gridfs.errors import NoFile
from root.db import fs, mdb
import base64
import io

# Configuration
UPLOAD_FOLDER = 'api/root/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def convert_to_backslashes(filepath):
    return filepath.replace("/", "\\")


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class PostAPI(Resource):

    def get(self):
        return jsonify({'message': 'hello'})

    def post(self):
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        caption = request.form.get('caption', '')
        hashtags=request.form.get('hashtags','')

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = UPLOAD_FOLDER + '/' + filename
            # filepath = convert_to_backslashes(filepath)

            # Ensure the upload folder exists
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)
            file.save(filepath)
            # Save the file to GridFS
            filename = secure_filename(file.filename)
            file.seek(0)
            file_id = fs.put(file, filename=filename,content_type=file.content_type)
            print(file.read())
            post_data = {
                'file_id': str(file_id),
                'filename': filename,
                'filepath': filepath,
                'content_type': file.content_type,
                'caption':caption,
                'hashtags':hashtags
            }
            mdb.posts_collection.insert_one(post_data)

            return ({"message": "Upload successful"}), 201
        else:
            return ({'error': 'File type not allowed'}), 400
    def delete(self,file_id):
        try:
            # Remove the file from GridFS
            fs.delete(ObjectId(file_id))
            
            # Delete the post from MongoDB
            result = mdb.posts_collection.delete_one({'file_id': file_id})
            
            if result.deleted_count == 0:
                return {'error': 'Post not found'}, 404
            
            return {"message": "Post deleted successfully"}, 200

        except NoFile:  # Handle the case where no file is found in GridFS
            return {'error': 'File not found in GridFS'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

class ServeImageAPI(Resource):
    def get(self, file_id):
        try:
            print(file_id)

            grid_out = fs.find_one(ObjectId(file_id))
            image = io.BytesIO(grid_out.read())
            image.seek(0)
            return send_file(image, mimetype=grid_out.content_type)

        except NoFile:  # Handle the case where no file is found
            return {'error': 'File not found'}, 404

        except Exception as e:
            return {'error': str(e)}, 500


class ImageListAPI(Resource):
    def get(self):
        posts = list(mdb.posts_collection.find())
        for post in posts:
            post['_id'] = str(post['_id'])
            post['file_id'] = str(post['file_id'])
            post['url'] = f"http://localhost:5000/image/{post['file_id']}"
            del post['filepath']
        return {'posts': posts}, 200
