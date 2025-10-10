import sqlite3
import hashlib
import random
import json
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

class DatabaseManager:
    
    def __init__(self):
        pass
    
    def c(self):
        conn = sqlite3.connect("./db/yonder-db.db") #TODO - Move to .cfg file
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

    def create_user(self, email : str, password : str) -> tuple[bool, str]:
        """Creates a new user in the database. Returns False if the user already exists, True if created successfully.
        """

        #Check if email is valid
        if email is None or email == "" or "@" not in email:
            return (False,"Invalid email address.")
        
        #Hash the email
        hashed_email = self.hash(email)
        
        #Connection
        conn = self.c().connection
        
        com = """
        SELECT COUNT(*) FROM users WHERE hashed_email = ?;
        """
        res = conn.execute(com, (hashed_email,)).fetchone()[0]
        
        if res > 0:
            return (False,"User already exists.")
        else:
            #Create the user
            salt = self.generate_salt() #Generate a salt
            
            hashed_password = self.hash(password + salt)
            
            username = email.split("@")[0] #Default username is the part of the email before the @
            
            com = """
            INSERT INTO users (hashed_email, username, password, salt) VALUES (?, ?, ?, ?);
            """
            
            conn.execute(com, (hashed_email, username, hashed_password, salt))
            conn.commit()
            print(f"Creating user {hashed_email} with username {username} and password {hashed_password} and salt {salt}")
            
            return (True,"User created successfully.")
        
    def authenticate_user(self, email : str, password : str) -> tuple[bool, str]:
        """Authenticates a user. Returns True if the email and password match, False otherwise.
        """
        #Hash the email
        hashed_email = self.hash(email)
        
        # Fetch user salt
        salt = self.c().execute("SELECT salt FROM users WHERE hashed_email = ?;", (hashed_email,)).fetchone()
        if salt is None:
            return (False,"User does not exist.") # User does not exist
        
        # Compute his password hash
        hashed_password = self.hash(password + salt[0])
        
        #Fetch his password hash
        stored_hashed_password = self.c().execute("SELECT password FROM users WHERE hashed_email = ?;", (hashed_email,)).fetchone()[0]

        if hashed_password == stored_hashed_password:
            return (True,"Authentication successful.")
        else:
            return (False,"Invalid password.")
        
        
    #region - Character Sheets
    
    def save_character_sheet(self, email : str, sheet) -> tuple[bool, str|dict]:
        """Saves a character sheet to the database. Returns (True, message) if successful, (False, error message) otherwise.
        """

        # Save the character sheet to the database
        conn = self.c().connection

        
        insert_sheet = """
        INSERT INTO sheets (hashed_email, content) VALUES ( ?, ?);
        """
        
        #Now with the ID update the sheet content
        update_sheet = """
        UPDATE sheets SET content = ? WHERE sheet_id = ?;
        """
        try:
            #Insert a temporary sheet to get the ID
            id = conn.execute(insert_sheet, (self.hash(email), "TEMP")).lastrowid
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

    def update_character_sheet(self, email : str, sheet_id : int, sheet) -> tuple[bool, str|dict]:
        """Updates a character sheet in the database. Returns (True, message) if successful, (False, error message) otherwise.
        """

        # Update the character sheet in the database
        conn = self.c().connection
        print(f"Updating sheet {sheet_id} for user {email} with content: {sheet}")
        
        update_sheet = """
        UPDATE sheets SET content = ? WHERE hashed_email = ? AND sheet_id = ?;
        """
        try:
            res = conn.execute(update_sheet, (json.dumps(sheet), email, sheet_id))
            
            if res.rowcount == 0:
                return (False, "No sheet found to update.")
            
            conn.commit()
            return (True, {"message": "Character sheet updated successfully.", "id": sheet_id})
        
        except Exception as e:
            print(f"Error updating character sheet: {e}")
            return (False, f"Error updating character sheet: {e}")
    
    def retrieve_character_sheet(self, email : str, sheet_id : int) -> tuple[bool, str | dict]:
        """Retrieves a character sheet from the database.

        Args:
            email (str): The email hash of the user.
            sheet_id (int): The ID of the sheet to retrieve.

        Returns:
            tuple[bool, str | dict]: A tuple containing a boolean indicating success or failure, and either an error message or the retrieved sheet data.
        """
        print(f"Retrieving sheet {sheet_id} for user {email}")
        conn = self.c().connection
        com = """
        SELECT content FROM sheets WHERE hashed_email = ? AND sheet_id = ?;
        """
        res = conn.execute(com, (email, sheet_id)).fetchone()
        if res is None:
            return (False, "Sheet not found.")
        else:
            return (True, json.loads(res[0]))

    def retrieve_all_sheets(self, email : str) -> tuple[bool, str | list]:
        """Retrieves all character sheets for a given user.

        Args:
            email (str): The email hash of the user.

        Returns:
            tuple[bool, str | list]: A tuple containing a boolean indicating success or failure, and either an error message or a list of all retrieved sheets.
        """
        
        
        conn = self.c().connection
        com = """
        SELECT content FROM sheets WHERE hashed_email = ?;
        """
        res = conn.execute(com, (email,)).fetchall()
        if not res:
            return (True, [])
        else:
            return (True, [json.loads(row[0]) for row in res])

    
    def delete_character_sheet(self, email : str, sheet_id : int) -> tuple[bool, str]:
        """Deletes a character sheet from the database.

        Args:
            email (str): The email hash of the user.
            sheet_id (int): The ID of the sheet to delete.
        Returns:
            tuple[bool, str]: A tuple containing a boolean indicating success or failure, and either an error message or a success message.
        """
        conn = self.c().connection
        com = """
        DELETE FROM sheets WHERE hashed_email = ? AND sheet_id = ?;
        """
        
        print(f"Deleting sheet {sheet_id} for user {email}")
        
        try:
            res = conn.execute(com, (email, sheet_id))
            if res.rowcount == 0:
                return (False, "No sheet found to delete.")
            
            conn.commit()
            return (True, "Sheet deleted successfully.")
        
        except Exception as e:
            print(f"Error deleting character sheet: {e}")
            return (False, f"Error deleting character sheet: {e}")
    #endregion