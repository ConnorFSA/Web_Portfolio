import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

JWT_SECRET = os.environ.get("JWT_SECRET")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.environ.get("ADMIN_PASSWORD_HASH", "").encode()
TOKEN_EXPIRY_HOURS = 8

# Credentials are validated against the configured admin account rather than a
# user database, which keeps the deployment model simple as only myself will be accessing the admin protected routes.
def verify_credentials(username: str, password: str) -> bool:
    """
    verifies the provided username and password against the stored admin credentials
    currently only support a single admin user defined in the .env file.
    Support for more users currently exceeds the scope
    """
    username_ok = username == ADMIN_USERNAME

    try:
        password_ok = bcrypt.checkpw(password.encode(), ADMIN_PASSWORD_HASH)
    except Exception:
        password_ok = False
        
    return username_ok and password_ok


def generate_jwt() -> str:
    """
    Generates a JWT token for the provided username with an expiration time
    admin privileges are hardcoded, 
    iat (issued at) is set to the current time
    exp (expiration) is set to the current time + TOKEN_EXPIRY_HOURS
    """
    # The token is intentionally minimal and carries only the admin claim, which is
    # sufficient for the access checks used by the protected admin routes.
    payload = {
        "admin": True,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS)
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_jwt(token: str) -> bool:
    """
    verifiess the provided JWT token against the secret key and checks for expiration
    return True if the toke is valid
    """
    try:
        jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
 