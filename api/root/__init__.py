from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from config import Config
from flask import send_from_directory



def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)
    app.debug = True
    CORS(app, resources={r"/*": {"origins": "*"}})

    jwt = JWTManager()

    api = Api(app)

    @app.route('/uploads/<filename>')
    def serve_image(filename):
        # Assuming the 'root/uploads' directory is located in the same directory as the Flask app
        print(f"Serving file: {filename}")
        return send_from_directory('root/uploads/', filename)

    from root.home import Home
    api.add_resource(Home, "/", endpoint="Home")

    from root.post import PostAPI, ImageListAPI,  ServeImageAPI
    api.add_resource(PostAPI, '/upload' ,'/post/<string:file_id>') 
    api.add_resource(ImageListAPI, '/images')
    api.add_resource( ServeImageAPI,'/image/<string:file_id>')
    from root.search import PostSearcher
    api.add_resource(PostSearcher,'/search')

    from root.forgotPassword import ForgotPassword
    api.add_resource(ForgotPassword, "/api/forgotpassword")
    from root.forgotPassword import VerifyEmail
    api.add_resource(VerifyEmail, "/api/verifyemail")
    from root.forgotPassword import ResetPassword
    api.add_resource(ResetPassword, "/api/resetpassword")
    
    from root.auth import auth_bp
    app.register_blueprint(auth_bp)

    from root.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix="/api")



    api.init_app(app)
    jwt.init_app(app)

    return app
