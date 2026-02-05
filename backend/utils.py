# utils.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    try:
        # Truncate password if it's too long for bcrypt (max 72 bytes)
        if len(plain_password.encode('utf-8')) > 72:
            # Truncate to 72 bytes (NOT characters)
            encoded = plain_password.encode('utf-8')[:72]
            plain_password = encoded.decode('utf-8', errors='ignore')
        
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    # Truncate password if it's too long for bcrypt (max 72 bytes)
    if len(password.encode('utf-8')) > 72:
        # Truncate to 72 bytes (NOT characters)
        encoded = password.encode('utf-8')[:72]
        password = encoded.decode('utf-8', errors='ignore')
    
    return pwd_context.hash(password)
