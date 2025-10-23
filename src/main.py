from fastapi import  Form, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sheet.sheet import CharacterSheet
from utils.db_manager import DatabaseManager
from auth.jwt import JWTManager
from pydantic import BaseModel
from utils.infoManager import InfoManager

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = ["http://localhost:5173"]

#JWT Secrets
#TODO - Move to .cfg file
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3600

#Database access
db = DatabaseManager()

#JWT Manager
jwt_manager = JWTManager(db, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)

#Info Manager
info_manager = InfoManager(db)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCredentials(BaseModel):
    email: str
    password: str

#region - Auth
@app.post("/auth/register")
def register_user(email : str = Form(...), password : str = Form(...)):
    result = db.create_user(email, password)
    if result[0]:
        return {"message": result[1]}
    else:
        raise HTTPException(status_code=400, detail=result[1])

# @app.post("/auth/login")
# def login_user(email: str = Form(...), password: str = Form(...)):
#     result = db.authenticate_user(email, password)
#     if result[0]:
#         return {"message": result[1]}
#     else:
#         raise HTTPException(status_code=400, detail=result[1])
    
@app.post("/auth/token")
def login_for_access_token(email: str = Form(...), password: str = Form(...)):
    res = jwt_manager.login_for_access_token(email, password)
    if res[0]:
        return res[1]
    else:
        raise HTTPException(status_code=403, detail=res[1])
    
@app.get("/auth/verify_token/{token}")
def verify_token(token: str):
    res = jwt_manager.verify_token(token)
    if res[0]:
        return {"message": "Token is valid", "email": res[1]}
    else:
        raise HTTPException(status_code=403, detail=res[1])
#region - Sheets

@app.get("/sheets/new")
def new_sheet():
    return CharacterSheet().jsonify()

@app.post("/sheets/new")
def save_sheet(sheet : dict):
    """Saves a new character sheet to the database. 
    Assigns it an ID
    Returns the ID if successful, so the frontend can start using it and we don't keep saving new sheets

    Args:
        sheet (dict): _description_

    Raises:
        HTTPException: _description_
    """
    email = jwt_manager.fetch_email_from_token(sheet.get('token', False))
    
    if email[0] is False:
        raise HTTPException(status_code=403, detail=email[1])
    else:
        email = email[1]
    
    res = db.save_character_sheet(email, sheet.get('sheet', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/sheets/{email}/{sheet_id}")
def fetch_sheet_specific(email: str, sheet_id: int):
    res = db.retrieve_character_sheet(email, sheet_id)
    if res[0] is False:
        raise HTTPException(status_code=404, detail=res[1])
    else:
        return res[1]
    
@app.post("/sheets/{email}/{sheet_id}")
def save_sheet_specific(email: str, sheet_id: int, sheet: dict):
    res = db.update_character_sheet(email, sheet_id, sheet.get('sheet', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/sheets/{email}")
def fetch_all_sheets(email: str):
    res = db.retrieve_all_sheets(email)
    if res[0] is False:
        raise HTTPException(status_code=404, detail=res[1])
    else:
        return res[1]
    
@app.delete("/sheets/{email}/{sheet_id}")
def delete_sheet(email: str, sheet_id: int, data : dict):
    token = data.get('token', False)
    if not token:
        raise HTTPException(status_code=403, detail="No token provided")
    
    if(jwt_manager.verify_token(token)[0] is False):
        raise HTTPException(status_code=403, detail="Invalid token")
    
    res = db.delete_character_sheet(email, sheet_id)
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

#endregion - Sheets

#region - Sheet Information

@app.get("/info/classes")
def get_available_classes( ):
    res = info_manager.get_available_classes()
    
    if res[0]:
        return {"classes": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch classes")

@app.post("/info/classes")
def save_new_class(data: dict):
    email = jwt_manager.fetch_email_from_token(data.get('token', False))
    
    if email[0] is False:
        raise HTTPException(status_code=403, detail=email[1])
    

    res = info_manager.save_new_class(data.get('class', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/info/weapons")
def get_available_weapons( ):
    res = info_manager.get_available_weapons()
    
    if res[0]:
        return {"weapons": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch weapons")
    
    
@app.get("/info/tools")
def get_available_tools( ):
    res = info_manager.get_available_tools()
    
    if res[0]:
        return {"tools": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch tools")
    
@app.get("/info/equipment")
def get_all_equipment( ):
    res = info_manager.get_all_equipment()
    
    if res[0]:
        return {"equipment": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch equipment")
    
@app.get("/info/feats")
def get_class_feats( playerClass : str):
    res = info_manager.get_class_features(playerClass)
    
    if res[0]:
        return {"feats": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch class features")

@app.post("/info/save_item")
def save_new_item(item: dict):
    email = jwt_manager.fetch_email_from_token(item.get('token', False))
    
    if email[0] is False:
        raise HTTPException(status_code=403, detail=email[1])
    else:
        res = info_manager.save_new_item(item.get('item', {}),item.get('type', ''))
        if res[0] is False:
            raise HTTPException(status_code=500, detail=res[1])
        else:
            return res[1]
#endregion
