from pathlib import Path
from fastapi import  Form, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import os

from dotenv import load_dotenv
import uvicorn

from auth.jwt import JWTManager
from utils.infoManager import InfoManager
from sheet.sheet import CharacterSheet
from utils.db_manager import DatabaseManager
from utils.WikidotScraper import WikidotScraper
from utils.logger import Logger
from utils.sheet_converter_to_text import ExportAsText

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
try:
    load_dotenv()  # Load environment variables from a .env file
except Exception as e:
    print(f"Error loading .env file: {e}\n")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

#JWT Secrets - Fetched from .env file
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
DB_PATH = os.getenv("DB_PATH", "NO_VALID_DATABASE_PATH")
#/logs under DB Path
LOG_PATH = os.path.join(os.path.dirname(DB_PATH), "logs")
ACCESS_TOKEN_EXPIRE_MINUTES = 3600

lg = Logger(folderpath=LOG_PATH)

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
    lg.log(f"[main.py/register_user] @POST[/auth/register] Registering user: {username}")
    result = db.create_user(username)
    if result[0]:
        return {"message": result[1]}
    else:
        lg.log_error(f"[main.py/register_user] @POST[/auth/register] Could not register user: {username}. Error: {result[1]}")
        raise HTTPException(status_code=400, detail=result[1])
    
@app.post("/auth/token")
def login_for_access_token(username: str = Form(...)):
    lg.log(f"[main.py/login_for_access_token] @POST[/auth/token] Logging in user: {db.hash(username)}")
    
    res = jwt_manager.login_for_access_token(username)
    if res[0]:
        return res[1]
    else:
        lg.log_error(f"[main.py/login_for_access_token] @POST[/auth/token] Could not log in user: {db.hash(username)}. Error: {res[1]}")
        raise HTTPException(status_code=403, detail=res[1])
    
@app.get("/auth/verify_token/{token}")
def verify_token(token: str):
    res = jwt_manager.verify_token(token)
    if res[0]:
        return {"message": "Token is valid", "username": res[1], 'is_admin': res[2]}
    else:
        lg.log_error(f"[main.py/verify_token] @GET[/auth/verify_token] Could not verify token. Error: {res[1]}")
        raise HTTPException(status_code=403, detail=res[1])
    
@app.get("/auth/is_admin/{token}")
def is_admin(token: str):    
    res = jwt_manager.is_admin(token)
    if res[0]:
        return {"is_admin": res[1]}
    else:
        lg.log_error(f"[main.py/is_admin] @GET[/auth/is_admin] Could not verify admin privileges for token. Error: {res[1]}")
        raise HTTPException(status_code=403, detail=res[1])
#endregion - Auth

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
    lg.log(f"[main.py/new_sheet] @POST[/sheets/new] Saving a new character sheet to the DB for user: {username}")
    
    if username[0] is False:
        lg.log_error(f"[main.py/new_sheet] @POST[/sheets/new] Could not authenticate user for saving new character sheet. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    res = db.save_character_sheet(sheet.get('username',""), sheet.get('sheet', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_sheet] @POST[/sheets/new] Could not save new character sheet for user: {username}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/sheets/{username}/{sheet_id}")
def fetch_sheet_specific(username: str, sheet_id: int):
    lg.log(f"[main.py/fetch_sheet_specific] @GET[/sheets/username/sheet_id] Fetching character sheet ({sheet_id}) for user: ({username})")
    res = db.retrieve_character_sheet(username, sheet_id)
    if res[0] is False:
        lg.log_error(f"[main.py/fetch_sheet_specific] @GET[/sheets/username/sheet_id] Could not fetch character sheet ({sheet_id}) for user: ({username}). Error: {res[1]}")
        raise HTTPException(status_code=404, detail=res[1])
    else:
        return res[1]
    
@app.post("/sheets/{username}/{sheet_id}")
def save_sheet_specific(username: str, sheet_id: int, sheet: dict):
    lg.log(f"[main.py/save_sheet_specific] @POST[/sheets/username/sheet_id] Saving character sheet ({sheet_id}) for user: ({username})")
    
    res = db.update_character_sheet(username, sheet_id, sheet.get('sheet', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_sheet_specific] @POST[/sheets/username/sheet_id] Could not save character sheet ({sheet_id}) for user: ({username}). Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/sheets/{username}")
def fetch_all_sheets(username: str):
    lg.log(f"[main.py/fetch_all_sheets] @GET[/sheets/username] Fetching all character sheets for user: ({username})")
    res = db.retrieve_all_sheets(username)
    if res[0] is False:
        lg.log_error(f"[main.py/fetch_all_sheets] @GET[/sheets/username] Could not fetch all character sheets for user: ({username}). Error: {res[1]}")
        raise HTTPException(status_code=404, detail=res[1])
    else:
        return res[1]
    
@app.delete("/sheets/{username}/{sheet_id}")
def delete_sheet(username: str, sheet_id: int, data : dict):
    lg.log(f"[main.py/delete_sheet] @DELETE[/sheets/username/sheet_id] Deleting character sheet ({sheet_id}) for user: ({username})")
    token = data.get('token', False)
    if not token:
        lg.log_error(f"[main.py/delete_sheet] @DELETE[/sheets/username/sheet_id] No token provided for deleting character sheet ({sheet_id}) for user: ({username})")
        raise HTTPException(status_code=403, detail="No token provided")
    
    if(jwt_manager.verify_token(token)[0] is False):
        lg.log_error(f"[main.py/delete_sheet] @DELETE[/sheets/username/sheet_id] Invalid token provided for deleting character sheet ({sheet_id}) for user: ({username})")
        raise HTTPException(status_code=403, detail="Invalid token")
    
    res = db.delete_character_sheet(username, sheet_id)
    if res[0] is False:
        lg.log_error(f"[main.py/delete_sheet] @DELETE[/sheets/username/sheet_id] Could not delete character sheet ({sheet_id}) for user: ({username}). Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/share/{username}/{sheet_id}")
def generate_shareable_link(username: str, sheet_id: int):
    lg.log(f"[main.py/generate_shareable_link] @GET[/share/username/sheet_id] Generating shareable link for character sheet ({sheet_id}) for user: ({username})")
    res = db.generate_shareable_link(username, sheet_id)
    if res[0] is False:
        lg.log_error(f"[main.py/generate_shareable_link] @GET[/share/username/sheet_id] Could not generate shareable link for character sheet ({sheet_id}) for user: ({username}). Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.post("/import/{share_code}")
def import_shared_sheet(share_code: str, data : dict):
    lg.log(f"[main.py/import_shared_sheet] @POST[/import/share_code] Importing shared character sheet with share code: ({share_code}) for user: ({data.get('username','')})")
    res = db.import_shared_sheet(share_code, data.get("username",""))
    if res[0] is False:
        lg.log_error(f"[main.py/import_shared_sheet] @POST[/import/share_code] Could not import shared character sheet with share code: ({share_code}) for user: ({data.get('username','')}). Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
#endregion - Sheets

#region - Sheet Information

@app.get("/info/classes")
def get_available_classes( ):
    # lg.log("[main.py/get_available_classes] @GET[/info/classes] Fetching all available classes")
    res = info_manager.get_available_classes()
    
    if res[0]:
        return {"classes": res[1]}
    else:
        lg.log_error(f"[main.py/get_available_classes] @GET[/info/classes] Could not fetch classes. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch classes")

@app.post("/info/classes")
def save_new_class(data: dict):
    
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_new_class] @POST[/info/classes] Could not authenticate user for saving new class. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/save_new_class] @POST[/info/classes] Saving a new class. Author: {username[1]}")

    res = info_manager.save_new_class(data.get('class', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_new_class] @POST[/info/classes] Could not save new class. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.put("/info/classes")
def save_class_edit(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_class_edit] @PUT[/info/classes] Could not authenticate user for editing class. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/save_new_class] @POST[/info/classes] Edited class {data.get('class', {}).get('name', '')}. Author: {username[1]}")
    
    
    res = info_manager.save_class_edit(data.get('class', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_class_edit] @PUT[/info/classes] Could not edit class {data.get('class', {}).get('name', '')}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.get("/info/subclasses/{class_name}")
def get_available_subclasses(class_name : str ):
    lg.log(f"[main.py/get_available_subclasses] @GET[/info/subclasses/class_name] Fetching available subclasses for class: {class_name}")
    
    res = info_manager.get_available_subclasses(class_name)
    
    if res[0]:
        return {"subclasses": res[1]}
    else:
        lg.log_error(f"[main.py/get_available_subclasses] @GET[/info/subclasses/class_name] Could not fetch subclasses for class: {class_name}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch classes")

@app.get("/info/subclasses")
def get_all_subclasses( ):
    # lg.log("[main.py/get_all_subclasses] @GET[/info/subclasses] Fetching all available subclasses")
    res = info_manager.get_all_subclasses()
    
    if res[0]:
        return {"subclasses": res[1]}
    else:
        lg.log_error(f"[main.py/get_all_subclasses] @GET[/info/subclasses] Could not fetch subclasses. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch subclasses")

@app.post("/info/subclasses")
def save_new_subclass(data: dict):
    
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_new_subclass] @POST[/info/subclasses/class_name] Could not authenticate user for saving new subclass. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/get_available_subclasses] @GET[/info/subclasses/class_name] Creating a new subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Author: {username[1]}")
    

    res = info_manager.save_new_subclass(data.get('subclass', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_new_subclass] @POST[/info/subclasses/class_name] Could not save new subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.put("/info/subclasses")
def save_subclass_edit(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_subclass_edit] @PUT[/info/subclasses] Could not authenticate user for editing subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/get_available_subclasses] @GET[/info/subclasses/class_name] Editing a subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Author: {username[1]}")
    
    
    res = info_manager.save_subclass_edit(data.get('subclass', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_subclass_edit] @PUT[/info/subclasses] Could not edit subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.delete("/info/subclasses")
def delete_subclass(data: dict):
    
    
    
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/delete_subclass] @DELETE[/info/subclasses/class_name] Could not authenticate user for deleting subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/get_available_subclasses] @DELETE[/info/subclasses/class_name] Deleting a subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Author: {username[1]}")
    
    
    res = info_manager.delete_subclass(data.get('subclass_name', ''),data.get('class_name',''))
    if res[0] is False:
        lg.log_error(f"[main.py/delete_subclass] @DELETE[/info/subclasses/class_name] Could not delete subclass {data.get('subclass', {}).get('name','')} for class: {data.get('subclass', {}).get('class_name','')}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/info/spells")
def get_available_spells( ):
    # lg.log("[main.py/get_available_spells] @GET[/info/spells] Fetching available spells")
    
    res = info_manager.get_available_spells()

    if res[0]:
        return {"spells": res[1]}
    else:
        lg.log_error(f"[main.py/get_available_spells] @GET[/info/spells] Could not fetch spells. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch spells")
    
    

@app.post("/info/spells")
def save_new_spell(data: dict):
    
    
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_new_spell] @POST[/info/spells] Could not authenticate user for saving new spell. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/save_new_spell] @POST[/info/spells] Creating a new spell {data.get('spell', {}).get('name','').strip().lower()}. Author: {username[1]}")

    res = info_manager.save_new_spell(data.get('spell', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_new_spell] @POST[/info/spells] Could not save new spell {data.get('spell', {}).get('name','').strip().lower()}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.put("/info/spells")
def save_spell_edit(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_spell_edit] @PUT[/info/spells] Could not authenticate user for editing spell. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/save_spell_edit] @PUT[/info/spells] Editing a spell {data.get('spell', {}).get('name','').strip().lower()}. Author: {username[1]}")
    

    res = info_manager.update_spell(data.get('spell', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_spell_edit] @PUT[/info/spells] Could not edit spell {data.get('spell', {}).get('name','').strip().lower()}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.delete("/info/spells")
def delete_spell( data: dict ):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/delete_spell] @DELETE[/info/spells] Could not authenticate user for deleting spell. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/delete_spell] @DELETE[/info/spells] Deleting a spell {data.get('spellName','').strip().lower()}. Author: {username[1]}")

    res = info_manager.delete_spell(data.get('spellName', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/delete_spell] @DELETE[/info/spells] Could not delete spell {data.get('spellName','').strip().lower()}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]
    
@app.get("/info/races")
def get_available_races( ):
    # lg.log("[main.py/get_available_races] @GET[/info/races] Fetching available races")
    res = info_manager.get_available_races()

    if res[0]:
        return {"races": res[1]}
    else:
        lg.log_error(f"[main.py/get_available_races] @GET[/info/races] Could not fetch races. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch races")

@app.post("/info/races")
def save_new_race(data: dict):
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_new_race] @POST[/info/races] Could not authenticate user for saving new race. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    
    lg.log(f"[main.py/save_new_race] @POST[/info/races] Creating a new race {data.get('race',{}).get('subrace'  )} {data.get('race', {}).get('name','')}. Author: {username[1]}")
    

    res = info_manager.save_new_race(data.get('race', {}))
    if res[0] is False:
        lg.log_error(f"[main.py/save_new_race] @POST[/info/races] Could not save new race {data.get('race',{}).get('subrace'  )} {data.get('race', {}).get('name','')}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail=res[1])
    else:
        return res[1]

@app.get("/info/weapons")
def get_available_weapons( ):
    # lg.log("[main.py/get_available_weapons] @GET[/info/weapons] Fetching available weapons.")
    
    res = info_manager.get_available_weapons()
    
    if res[0]:
        return {"weapons": res[1]}
    else:
        lg.log_error(f"[main.py/get_available_weapons] @GET[/info/weapons] Could not fetch weapons. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch weapons")
    
    
@app.get("/info/tools")
def get_available_tools( ):
    # lg.log("[main.py/get_available_tools] @GET[/info/tools] Fetching available tools.")
    res = info_manager.get_available_tools()
    
    if res[0]:
        return {"tools": res[1]}
    else:
        lg.log_error(f"[main.py/get_available_tools] @GET[/info/tools] Could not fetch tools. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch tools")
    
@app.get("/info/equipment")
def get_all_equipment( ):
    # lg.log("[main.py/get_all_equipment] @GET[/info/equipment] Fetching all available equipment.")
    res = info_manager.get_all_equipment()
    
    if res[0]:
        return {"equipment": res[1]}
    else:
        lg.log_error(f"[main.py/get_all_equipment] @GET[/info/equipment] Could not fetch equipment. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch equipment")
    
@app.get("/info/feats")
def get_class_feats( playerClass : str):
    lg.log(f"[main.py/get_class_feats] @GET[/info/feats] Fetching class features for class: {playerClass}")
    res = info_manager.get_class_features(playerClass)
    
    if res[0]:
        return {"feats": res[1]}
    else:
        lg.log_error(f"[main.py/get_class_feats] @GET[/info/feats] Could not fetch class features for class: {playerClass}. Error: {res[1]}")
        raise HTTPException(status_code=500, detail="Could not fetch class features")

@app.post("/info/save_item")
def save_new_item(item: dict):
    
    username = jwt_manager.fetch_username_from_token(item.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/save_new_item] @POST[/info/save_item] Could not authenticate user for saving new item. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    else:
        
        lg.log(f"[main.py/save_new_item] @POST[/info/save_item] Saving a new item of type {item.get('type','')} with name {item.get('item', {}).get('name','')}. Author: {username[1]}")
        
        res = info_manager.save_new_item(item.get('item', {}),item.get('type', ''))
        if res[0] is False:
            lg.log_error(f"[main.py/save_new_item] @POST[/info/save_item] Could not save new item of type: {item.get('type','')} with name {item.get('item', {}).get('name','')}. Error: {res[1]}")
            raise HTTPException(status_code=500, detail=res[1])
        else:
            return res[1]
        
@app.post("/info/edit_item")
def edit_item(data: dict):
    
    username = jwt_manager.fetch_username_from_token(data.get('token', False))
    
    if username[0] is False:
        lg.log_error(f"[main.py/edit_item] @POST[/info/edit_item] Could not authenticate user for item edit. Error: {username[1]}")
        raise HTTPException(status_code=403, detail=username[1])
    else:
        
        lg.log(f"[main.py/edit_item] @POST[/info/edit_item] New edit of item type: {data.get('type','')} with name {data.get('item', {}).get('name','')}. Author: {username[1]}")
        
        res = info_manager.edit_item(data.get('item', {}),data.get('type', ''))
        if res[0] is False:
            lg.log_error(f"[main.py/edit_item] @POST[/info/edit_item] Could not edit item of type: {data.get('type','')} with name {data.get('item', {}).get('name','')}. Error: {res[1]}")
            raise HTTPException(status_code=500, detail=res[1])
        else:
            return res[1]
        
@app.post("/info/delete_item")
def delete_item(data: dict):
    name = data.get('itemName', '')
    token = data.get('token', False)
    type = data.get('itemType', 'None')
    
    if(type == 'None' or name == '' or not token):
        lg.log_error(f"[main.py/delete_item] @POST[/info/delete_item] Invalid item type: {type} for deletion. Error: Invalid request parameters")
        
        raise HTTPException(status_code=400, detail="Invalid request parameters")

    username = jwt_manager.fetch_username_from_token(token)
    
    if username[0] is False:
        lg.log_error(f"[main.py/delete_item] @POST[/info/delete_item] Could not authenticate user for item deletion. Error: {username[1]}")
        
        raise HTTPException(status_code=403, detail=username[1])
    else:
        
        lg.log(f"[main.py/delete_item] @POST[/info/delete_item] Deleting item of type: {type} with name {name}. Author: {username[1]}")
        
        res = info_manager.delete_item(name,type)
        if res[0] is False:
            lg.log_error(f"[main.py/delete_item] @POST[/info/delete_item] Could not delete item of type: {type} with name {name}. Error: {res[1]}")
            raise HTTPException(status_code=500, detail=res[1])
        else:
            return res[1]
#endregion

#region - WikiDot WebScraping

@app.get("/wikidot/class/{class_name}")
def get_wikidot_class_info(class_name: str):
    lg.log(f"[main.py/get_wikidot_class_info] @GET[/wikidot/class/{class_name}] Fetching Wikidot class info for class: {class_name}")
    
    try:
        res = wks.fetch_class_features(class_name.lower()).fetch_results()
    except Exception as e:
        lg.log_error(f"[main.py/get_wikidot_class_info] @GET[/wikidot/class/{class_name}] Could not fetch class info for class: {class_name}. Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch class info")

    return res

@app.get("/wikidot/subclass/{class_name}/{subclass_name}")
#Gets a JSON object with with subclass and class name as parameters
def get_wikidot_subclass_info(subclass_name: str, class_name: str):
    lg.log(f"[main.py/get_wikidot_subclass_info] @GET[/wikidot/subclass/{class_name}/{subclass_name}] Fetching Wikidot subclass info for subclass: {subclass_name} and class: {class_name}")
    
    try:
        res = wks.fetch_subclass_features(subclass_name.lower(), class_name.lower()).fetch_results()
    except Exception as e:
        lg.log_error(f"[main.py/get_wikidot_subclass_info] @GET[/wikidot/subclass/{class_name}/{subclass_name}] Could not fetch subclass info for subclass: {subclass_name} and class: {class_name}. Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch subclass info")
    
    return res


@app.get("/wikidot/item/{item_name}")
def get_wikidot_item_info(item_name: str):
    lg.log(f"[main.py/get_wikidot_item_info] @GET[/wikidot/item/{item_name}] Fetching Wikidot item info for item: {item_name}")
    try:
        res = wks.fetch_item_info(item_name.lower()).format_results_dndroll_items()
    except Exception as e:
        lg.log_error(f"[main.py/get_wikidot_item_info] @GET[/wikidot/item/{item_name}] Could not fetch item info for item: {item_name}. Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch item info")
    return res

@app.get("/wikidot/spell/{spell_name}")
def get_wikidot_spell_info(spell_name: str):
    lg.log(f"[main.py/get_wikidot_spell_info] @GET[/wikidot/spell/{spell_name}] Fetching Wikidot spell info for spell: {spell_name}")
    try:
        res = wks.fetch_spell_info(spell_name.lower()).format_results_dndroll_spells()
    except Exception as e:
        lg.log_error(f"[main.py/get_wikidot_spell_info] @GET[/wikidot/spell/{spell_name}] Could not fetch spell info for spell: {spell_name}. Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch spell info")
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
    
    lg.log(f"[main.py/export_sheet_txt] @GET[/export/txt/{username}/{sheet_id}] Exporting character sheet as text for user: {username} and sheet ID: {sheet_id}")
    
    res = db.retrieve_character_sheet(username, sheet_id)
    if res[0] is False:
        lg.log_error(f"[main.py/export_sheet_txt] @GET[/export/txt/{username}/{sheet_id}] Could not find sheet for user: {username} and sheet ID: {sheet_id}. Error: {res[1]}")
        raise HTTPException(status_code=404, detail=res[1])
    else:
        if(type(res[1]) is dict):
            
            return ExportAsText(res[1])
        
#endregion - Export & Download

def find_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

BASE_DIR = Path(__file__).resolve().parent
CERT_DIR = BASE_DIR / "certs"
RUNNING_ON_CONTAINER = os.getenv("RUNNING_ON_CONTAINER", "false").lower() == "true"

if __name__ == "__main__":
    if(RUNNING_ON_CONTAINER):
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
    else:
        uvicorn.run("main:app", host=find_ip(), port=8000,ssl_keyfile=str(CERT_DIR / 'localhost-key.pem'), ssl_certfile=str(CERT_DIR / 'localhost.pem'), reload=True)
        
    
