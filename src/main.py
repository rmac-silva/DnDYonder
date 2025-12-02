from fastapi import  Form, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import os
import ssl
from dotenv import load_dotenv
import uvicorn

from auth.jwt import JWTManager
from utils.infoManager import InfoManager
from sheet.sheet import CharacterSheet
from utils.db_manager import DatabaseManager
from utils.WikidotScraper import WikidotScraper
from utils.sheet_converter_to_text import ExportAsText

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

#JWT Secrets - Fetched from .env file
load_dotenv()  # Load environment variables from a .env file
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
DB_PATH = os.getenv("DB_PATH", "NO_VALID_DATABASE_PATH")

ACCESS_TOKEN_EXPIRE_MINUTES = 3600

#Database access
db = DatabaseManager(DB_PATH, SECRET_KEY)

#Scraper
wks = WikidotScraper()

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
    username: str

#region - Auth

@app.post("/auth/register")
def register_user(username : str = Form(...)):
    result = db.create_user(username)
    if result[0]:
        return {"message": result[1]}
    else:
        raise HTTPException(status_code=400, detail=result[1])
    
@app.post("/auth/token")
def login_for_access_token(username: str = Form(...)):
    res = jwt_manager.login_for_access_token(username)
    if res[0]:
        return res[1]
    else:
        raise HTTPException(status_code=403, detail=res[1])
    
@app.get("/auth/verify_token/{token}")
def verify_token(token: str):
    res = jwt_manager.verify_token(token)
    if res[0]:
        return {"message": "Token is valid", "username": res[1]}
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
    username = jwt_manager.fetch_username_from_token(sheet.get('token', False))
    
    if username[0] is False:
        raise HTTPException(status_code=403, detail=username[1])
    
    res = db.save_character_sheet(sheet.get('username',""), sheet.get('sheet', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/sheets/{username}/{sheet_id}")
def fetch_sheet_specific(username: str, sheet_id: int):
    res = db.retrieve_character_sheet(username, sheet_id)
    if res[0] is False:
        raise HTTPException(status_code=404, detail=res[1])
    else:
        return res[1]
    
@app.post("/sheets/{username}/{sheet_id}")
def save_sheet_specific(username: str, sheet_id: int, sheet: dict):
    res = db.update_character_sheet(username, sheet_id, sheet.get('sheet', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/sheets/{username}")
def fetch_all_sheets(username: str):
    print("Fetching all sheets for user:", username)
    res = db.retrieve_all_sheets(username)
    if res[0] is False:
        raise HTTPException(status_code=404, detail=res[1])
    else:
        return res[1]
    
@app.delete("/sheets/{username}/{sheet_id}")
def delete_sheet(username: str, sheet_id: int, data : dict):
    token = data.get('token', False)
    if not token:
        raise HTTPException(status_code=403, detail="No token provided")
    
    if(jwt_manager.verify_token(token)[0] is False):
        raise HTTPException(status_code=403, detail="Invalid token")
    
    res = db.delete_character_sheet(username, sheet_id)
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/share/{username}/{sheet_id}")
def generate_shareable_link(username: str, sheet_id: int):
    res = db.generate_shareable_link(username, sheet_id)
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.post("/import/{share_code}")
def import_shared_sheet(share_code: str, data : dict):
    
    res = db.import_shared_sheet(share_code, data.get("username",""))
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
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        raise HTTPException(status_code=403, detail=username[1])
    

    res = info_manager.save_new_class(data.get('class', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.get("/info/subclasses/{class_name}")
def get_available_subclasses(class_name : str ):
    res = info_manager.get_available_subclasses(class_name)
    
    if res[0]:
        return {"subclasses": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch classes")

@app.post("/info/subclasses")
def save_new_subclass(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        raise HTTPException(status_code=403, detail=username[1])
    

    res = info_manager.save_new_subclass(data.get('subclass', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.get("/info/spells")
def get_available_spells( ):
    res = info_manager.get_available_spells()

    if res[0]:
        return {"spells": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch spells")

@app.post("/info/spells")
def save_new_spell(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        raise HTTPException(status_code=403, detail=username[1])
    

    res = info_manager.save_new_spell(data.get('spell', {}))
    if res[0] is False:
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.get("/info/races")
def get_available_races( ):
    res = info_manager.get_available_races()

    if res[0]:
        return {"races": res[1]}
    else:
        raise HTTPException(status_code=500, detail="Could not fetch races")

@app.post("/info/races")
def save_new_race(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        raise HTTPException(status_code=403, detail=username[1])
    

    res = info_manager.save_new_race(data.get('race', {}))
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
    print("Saving new item:", item)
    username = jwt_manager.fetch_username_from_token(item.get('token', False))
    
    if username[0] is False:
        raise HTTPException(status_code=403, detail=username[1])
    else:
        res = info_manager.save_new_item(item.get('item', {}),item.get('type', ''))
        if res[0] is False:
            raise HTTPException(status_code=500, detail=res[1])
        else:
            return res[1]
#endregion

#region - WikiDot WebScraping

@app.get("/wikidot/class/{class_name}")
def get_wikidot_class_info(class_name: str):
    res = wks.fetch_class_features(class_name.lower()).fetch_results()
    return res

@app.get("/wikidot/subclass/{class_name}/{subclass_name}")
#Gets a JSON object with with subclass and class name as parameters
def get_wikidot_subclass_info(subclass_name: str, class_name: str):
    
    res = wks.fetch_subclass_features(subclass_name.lower(), class_name.lower()).fetch_results()
    return res


@app.get("/wikidot/item/{item_name}")
def get_wikidot_item_info(item_name: str):
    print("Fetching Wikidot info for item:", item_name)
    res = wks.fetch_item_info(item_name.lower()).format_results_dndroll_items()
    return res

@app.get("/wikidot/spell/{spell_name}")
def get_wikidot_spell_info(spell_name: str):
    print("Fetching Wikidot info for item:", spell_name)
    res = wks.fetch_spell_info(spell_name.lower()).format_results_dndroll_spells()
    return res


#endregion

#region - Export & Download
@app.get("/export/txt/{username}/{sheet_id}")
def export_sheet_txt(username: str, sheet_id: int):
    """Returns a .txt representation of the character sheet

    Args:
        username (str): the username
        sheet_id (int): the id of the sheet to convert

    Raises:
        HTTPException: If the sheet does not exist, a 404 will be raised

    Returns:
        str: The character sheet in a text format
    """
    res = db.retrieve_character_sheet(username, sheet_id)
    if res[0] is False:
        raise HTTPException(status_code=404, detail=res[1])
    else:
        if(type(res[1]) is dict):
            
            return ExportAsText(res[1])
        
        
if __name__ == "__main__":
    uvicorn.run("main:app", host="192.168.1.71", port=8000,ssl_keyfile='./certs/localhost-key.pem', ssl_certfile='./certs/localhost.pem', reload=True)