import json
from utils.db_manager import DatabaseManager
from sheet.cclass import CharacterClass

class InfoManager():
    
    def __init__(self, dbm: DatabaseManager):
        self.dbm = dbm
        
    def get_available_classes(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name,content FROM classes;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for cclass in res:
                formatted_array.append({'c_name': cclass[0], 'c_content': json.loads(cclass[1])})
            return (True, formatted_array)
        
    def get_available_weapons(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name FROM weapons;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for weapon in res:
                formatted_array.append(weapon[0])
                
            return (True, formatted_array)

    def get_available_tools(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name FROM tools;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for tool in res:
                formatted_array.append(tool[0])
            return (True, formatted_array)

    def get_available_armors(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name FROM armors;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for armor in res:
                formatted_array.append(armor[0])
            return (True, formatted_array)

    def get_all_equipment(self):
        items_merged = []
        
        weapons = self.get_available_weapons()
        if weapons[0]:
            items_merged.extend(weapons[1])
            
        tools = self.get_available_tools()
        if tools[0]:
            items_merged.extend(tools[1])
            
        armors = self.get_available_armors()
        if armors[0]:
            items_merged.extend(armors[1])
            
        return (True,items_merged) 
        
    def get_class_features(self, playerClass: str):
        conn = self.dbm.c().connection
        
        com = """
        SELECT content FROM classes
        WHERE name = ?;
        """
        
        res = conn.execute(com, (playerClass,)).fetchone()
        
        if res is None:
            return (True, [])
        else:
            serialized_class = CharacterClass()
            serialized_class.load_from_dict(res[0])
            return (True, serialized_class.get_features())

    #region - Adding Items & Information
    
    def save_new_item(self, item: dict,type:str) -> tuple[bool, str]:
        
        conn = self.dbm.c().connection
        
        if(type == 'Weapon'):
            com = """
            INSERT INTO weapons (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Weapon added successfully")
        if(type == 'Armor'):
            com = """
            INSERT INTO armors (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Armor added successfully")
        if(type == 'Tool'):
            com = """
            INSERT INTO tools (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Tool added successfully")
        else:
             return (False, "Invalid item type")
         
    def save_new_class(self, playerClass: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                INSERT INTO classes (name, content) VALUES (?, ?);
                """
                
            conn.execute(com, (playerClass.get('class_name',''), json.dumps(playerClass)))
            conn.commit()
            
            return (True, "Class added successfully")
        except Exception as e:
            return (False, str(e)) 
        