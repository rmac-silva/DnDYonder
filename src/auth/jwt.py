import datetime as dt
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
import utils.db_manager as dbm

class JWTManager:
    
    def __init__(self, dbm : dbm.DatabaseManager, secret_key: str, algorithm: str = "HS256", expiration_minutes: int = 30):
        self.dbm = dbm
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.expiration_minutes = expiration_minutes

    def create_token(self, data: dict, expires_delta: dt.timedelta | None = None) -> str:
        to_encode = data.copy()
        
        if expires_delta:
            expire = dt.datetime.now(dt.timezone.utc) + expires_delta
        else:
            expire = dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=self.expiration_minutes)

        to_encode.update({"exp": expire})
        jwt_token = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return jwt_token

    def login_for_access_token(self, email : str, password : str) -> tuple[bool,str | dict]:
        user = self.dbm.authenticate_user(email, password)
        if not user[0]:
            return (False, user[1])

        access_token_expires = dt.timedelta(minutes=self.expiration_minutes)
        access_token = self.create_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        
        return (True, {"access_token": access_token, "token_type": "bearer", "email": self.dbm.hash(email)})
    
    def verify_token(self, token : str = Depends(OAuth2PasswordRequestForm)) -> tuple[bool, str]:
        credentials_exception = (False, "Could not validate credentials")
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            email = payload.get("sub")
            if email is None:
                return (False, "Email not found in token")
        except JWTError as e:
            return (False, f"Could not decode token: {str(e)}")
        
        user = self.dbm.authenticate_user(email, "") #Check if user exists
        if not user:
            return credentials_exception
        
        return (True, self.dbm.hash(email))
    
    def fetch_email_from_token(self, token : str) -> tuple[bool, str]:
        """Fetches the email from a given JWT token. Returns (True, email) if successful, (False, error message) otherwise.
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            email = payload.get("sub")
            
            if email is None:
                return (False, "Token does not contain an email.")
            return (True, email)
        except JWTError as e:
            #We got here, why?
            print(f"JWT Error: expired signature!!!{str(e)}")
            return (False, f"Could not decode token: {str(e)}")