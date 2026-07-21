from functools import wraps
from flask import Blueprint, request, jsonify 
from app.services.auth import (
    verify_credentials,
    generate_jwt,
    verify_jwt
    )

auth_bp = Blueprint("auth", __name__, url_prefix='/api/auth')

def require_admin(f):
    """
    decorator to protect routes that require authentication
    checks for the presence of a valid JWT token in thr Authorization header of the request
    """
    # f is the function being decorated
    # wraps is a decorator that preserves the original fucntion's metadata when it is warpped by the require_admin decorator
    @wraps(f)
    
    # decorated function is the wrapper function that will be called instead of the original function f
    def decorated(*args, **kwargs):
        # get the authorization header form the request
        auth_header = request.headers.get("Authorization", "")
        
        # check if the authorization header is present and starts with "Bearer " according to industry standard
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401
        
        # remove the "Bearer " prefix and strip and leading or trailing whitespace from the token
        token = auth_header.removeprefix("Bearer ").strip()
        
        # check if the token is persent and vaid
        if not token or verify_jwt(token):
            return jsonify({"error": "Unauthorized"}), 401
        
        # if all check pass call the original function, passing along any arguments and keyword arguments
        return f(*args, **kwargs)
    return decorated

# ----------- ROUTES -------------

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Accepts JSON {usernamr: str, password: str}
    Returns { token: <JWT>} if the credential are valid
            { error: ... } on faliure, always 401 not 403 to avoid confirming the username
    """
    
    data = request.get_json(silent=True)
    
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    
    username = data.get ("username", "")
    password = data.get ("password", "")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    if not verify_credentials(username, password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = generate_jwt()
    return jsonify({"token": token}), 200
    
    
@auth_bp.route("/verify", methods=["GET"])
@require_admin
def verify():
    """
    verifies the provided JWT token is still valid
    returns 200 if the token is valid
    """
    return jsonify({"message": "Token is valid"}), 200


@auth_bp.route("/logout", methods=["POST"])
@require_admin
def logout():
    """
    the token is not stored server side so theres noting to revoke, 
    the frontend deletes is from sessionStorage on recipt of 200
    """
    return jsonify({"success": True}), 200