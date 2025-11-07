import sqlite3
import hashlib
import random
import json
from db_utils.db_setup import setup_database
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

class DatabaseManager:
    
    def __init__(self,db_path : str):
        self.db_path = db_path
        print(f"Database path: {db_path}")
        setup_database(self.db_path)
        pass
    
    def c(self):
        conn = sqlite3.connect(self.db_path)
        return conn.cursor()
    
    def hash(self, input : str) -> str:
        
        return hashlib.sha256(input.encode()).hexdigest()
    
    def generate_salt(self) -> str:
        """Generates a random salt. Currently just a placeholder.
        """
        chars= []
        for i in range(16):
            chars.append(random.choice(ALPHABET))
        return "".join(chars)

    def create_user(self, username : str) -> tuple[bool, str]:
        """Creates a new user in the database. Returns False if the user already exists, True if created successfully.
        """

        #Check if username is valid
        if username is None or username == "":
            return (False,"Invalid username.")
        
        #Hash the username
        hashed_username = self.hash(username)
        
        #Connection
        conn = self.c().connection
        
        com = """
        SELECT COUNT(*) FROM users WHERE username = ?;
        """
        res = conn.execute(com, (hashed_username,)).fetchone()[0]
        
        if res > 0:
            return (False,"User already exists.")
        else:
            #Create the user
            com = """
            INSERT INTO users (username) VALUES (?);
            """
            conn.execute(com, (hashed_username,))
            conn.commit()
            print(f"Creating user {hashed_username} with username {username} ")
            
            return (True,"User created successfully.")
        
    def authenticate_user(self, username : str) -> tuple[bool, str]:
        """Authenticates a user. Returns True if the username matches, False otherwise.
        """
        #Hash the username
        hashed_username = self.hash(username)
        
        # Fetch user salt
        userCount = self.c().execute("SELECT Count(*) FROM users WHERE username = ?;", (hashed_username,)).fetchone()
        if userCount[0] == 0:
            return (False,"User does not exist.") # User does not exist
        else:
            return (True,"User authenticated.")
        
        
        
    #region - Character Sheets
    
    def save_character_sheet(self, username : str, sheet) -> tuple[bool, str|dict]:
        """Saves a character sheet to the database. Returns (True, message) if successful, (False, error message) otherwise.
        """

        # Save the character sheet to the database
        conn = self.c().connection

        
        insert_sheet = """
        INSERT INTO sheets (username, content) VALUES ( ?, ?);
        """
        
        #Now with the ID update the sheet content
        update_sheet = """
        UPDATE sheets SET content = ? WHERE sheet_id = ?;
        """
        try:
            #Insert a temporary sheet to get the ID
            id = conn.execute(insert_sheet, (username, "TEMP")).lastrowid
            print("Last row id:", id)
            #Now update the sheet with the actual content
            altered_sheet = sheet.copy()
            altered_sheet['id'] = id
            conn.execute(update_sheet, (json.dumps(altered_sheet), id))
            
            conn.commit()
            return (True, {"message": "Character sheet saved successfully.", "id": id})
        except Exception as e:
            print(f"Error saving character sheet: {e}")
            return (False, f"Error saving character sheet: {e}")

    def update_character_sheet(self, username : str, sheet_id : int, sheet) -> tuple[bool, str|dict]:
        """Updates a character sheet in the database. Returns (True, message) if successful, (False, error message) otherwise.
        """

        # Update the character sheet in the database
        conn = self.c().connection
        print(f"Updating sheet {sheet_id} for user {username} with content: {sheet}")
        
        update_sheet = """
        UPDATE sheets SET content = ? WHERE username = ? AND sheet_id = ?;
        """
        try:
            res = conn.execute(update_sheet, (json.dumps(sheet), username, sheet_id))
            
            if res.rowcount == 0:
                return (False, "No sheet found to update.")
            
            conn.commit()
            return (True, {"message": "Character sheet updated successfully.", "id": sheet_id})
        
        except Exception as e:
            print(f"Error updating character sheet: {e}")
            return (False, f"Error updating character sheet: {e}")
    
    def retrieve_character_sheet(self, username : str, sheet_id : int) -> tuple[bool, str | dict]:
        """Retrieves a character sheet from the database.

        Args:
            username (str): The username hash of the user.
            sheet_id (int): The ID of the sheet to retrieve.

        Returns:
            tuple[bool, str | dict]: A tuple containing a boolean indicating success or failure, and either an error message or the retrieved sheet data.
        """
        print(f"Retrieving sheet {sheet_id} for user {username}")
        conn = self.c().connection
        com = """
        SELECT content FROM sheets WHERE username = ? AND sheet_id = ?;
        """
        res = conn.execute(com, (username, sheet_id)).fetchone()
        if res is None:
            return (False, "Sheet not found.")
        else:
            return (True, json.loads(res[0]))

    def retrieve_all_sheets(self, username : str) -> tuple[bool, str | list]:
        """Retrieves all character sheets for a given user.

        Args:
            username (str): The username hash of the user.

        Returns:
            tuple[bool, str | list]: A tuple containing a boolean indicating success or failure, and either an error message or a list of all retrieved sheets.
        """
        
        
        conn = self.c().connection
        com = """
        SELECT content FROM sheets WHERE username = ?;
        """
        res = conn.execute(com, (username,)).fetchall()
        if not res:
            return (True, [])
        else:
            return (True, [json.loads(row[0]) for row in res])

    
    def delete_character_sheet(self, username : str, sheet_id : int) -> tuple[bool, str]:
        """Deletes a character sheet from the database.

        Args:
            username (str): The username hash of the user.
            sheet_id (int): The ID of the sheet to delete.
        Returns:
            tuple[bool, str]: A tuple containing a boolean indicating success or failure, and either an error message or a success message.
        """
        conn = self.c().connection
        com = """
        DELETE FROM sheets WHERE username = ? AND sheet_id = ?;
        """
        
        print(f"Deleting sheet {sheet_id} for user {username}")
        
        try:
            res = conn.execute(com, (username, sheet_id))
            if res.rowcount == 0:
                return (False, "No sheet found to delete.")
            
            conn.commit()
            return (True, "Sheet deleted successfully.")
        
        except Exception as e:
            print(f"Error deleting character sheet: {e}")
            return (False, f"Error deleting character sheet: {e}")
    #endregion