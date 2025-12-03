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

    def login_for_access_token(self, username : str) -> tuple[bool,str | dict]:
        user = self.dbm.authenticate_user(username)
        if not user[0]:
            return (False, user[1])

        access_token_expires = dt.timedelta(minutes=self.expiration_minutes)
        access_token = self.create_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        
        return (True, {"access_token": access_token, "token_type": "bearer", "username": self.dbm.hash(username)})
    
    def verify_token(self, token : str = Depends(OAuth2PasswordRequestForm)) -> tuple[bool, str, bool]:
        credentials_exception = (False, "Could not validate credentials",False)
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            username = payload.get("sub")
            if username is None:
                return (False, "Username not found in token",False)
        except JWTError as e:
            return (False, f"Could not decode token: {str(e)}",False)
        
        user = self.dbm.authenticate_user(username) #Check if user exists
        
        if not user:
            return credentials_exception
        
        return (True, self.dbm.hash(username), self.dbm.check_admin_privileges(username))
    
    def fetch_username_from_token(self, token : str) -> tuple[bool, str]:
        """Fetches the username from a given JWT token. Returns (True, username) if successful, (False, error message) otherwise.
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            username = payload.get("sub")
            
            if username is None:
                return (False, "Token does not contain a username.")
            return (True, username)
        except JWTError as e:
            return (False, f"Could not decode token: {str(e)}")
        
    def is_admin(self, token : str) -> tuple[bool, bool | str]:
        """Checks if the user associated with the given JWT token has admin privileges.
        Returns (True, is_admin) if successful, (False, error message) otherwise.
        """
        res = self.fetch_username_from_token(token)
        if not res[0]:
            return (False, res[1])
        
        username = res[1]
        is_admin = self.dbm.check_admin_privileges(username)
        return (True, is_admin)