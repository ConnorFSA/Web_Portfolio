import bcrypt, secrets
print("JWT_SECRET=" + secrets.token_hex(32))
print("ADMIN_USERNAME=admin")
pw = input("Enter your admin password: ").encode()
print("ADMIN_PASSWORD_HASH=" + bcrypt.hashpw(pw, bcrypt.gensalt()).decode())