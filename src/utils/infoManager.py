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
        
    def get_available_subclasses(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name,content FROM subclasses;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for cclass in res:
                formatted_array.append({'c_name': cclass[0], 'c_content': json.loads(cclass[1])})
            return (True, formatted_array)
        
    def get_available_spells(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name,content FROM spells;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for spell in res:
                formatted_array.append({'s_name': spell[0], 's_content': json.loads(spell[1])})
            return (True, formatted_array)

    def get_available_races(self):
        conn = self.dbm.c().connection

        com = """
        SELECT name,content FROM races;
        """

        res = conn.execute(com).fetchall()

        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for race in res:
                formatted_array.append({'r_name': race[0], 'r_content': json.loads(race[1])})
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
        
        conn = self.dbm.c().connection
        
        com = """
        SELECT name,content FROM weapons;
        """
        
        res = conn.execute(com).fetchall()
        if(res is not None):
            for weapon in res:
                items_merged.append({'name':weapon[0],'content':json.loads(weapon[1]),'type':'Weapon'})
        
        com = """
        SELECT name,content FROM armors;
        """
        
        res = conn.execute(com).fetchall()
        if(res is not None):
            for armor in res:
                items_merged.append({'name':armor[0],'content':json.loads(armor[1]),'type':'Armor'})
        
        com = """
        SELECT name,content FROM tools;
        """
        res = conn.execute(com).fetchall()
        if(res is not None):
            for tool in res:
                items_merged.append({'name':tool[0],'content':json.loads(tool[1]),'type':'Tool'})
        
        com = """
        SELECT name,content FROM miscellaneous;
        """
        res = conn.execute(com).fetchall()
        if(res is not None):
            for misc in res:
                items_merged.append({'name':misc[0],'content':json.loads(misc[1]),'type':'Misc.'})
                
        
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
        
        if(type == 'Misc.'):
            com = """
            INSERT INTO miscellaneous (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Miscellaneous item added successfully")
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
        
    def save_new_subclass(self, playerClass: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                INSERT INTO subclasses (name, content) VALUES (?, ?);
                """

            conn.execute(com, (playerClass.get('name',''), json.dumps(playerClass)))
            conn.commit()

            return (True, "Subclass added successfully")
        except Exception as e:
            return (False, str(e))
        
    def save_new_spell(self, spell: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection

            com = """
                INSERT INTO spells (name, content) VALUES (?, ?);
                """

            conn.execute(com, (spell.get('name',''), json.dumps(spell)))
            conn.commit()

            return (True, "Spell added successfully")
        except Exception as e:
            return (False, str(e))

            com = """
                INSERT INTO subclasses (name, content) VALUES (?, ?);
                """

            conn.execute(com, (playerClass.get('name',''), json.dumps(playerClass)))
            conn.commit()

            return (True, "Subclass added successfully")
        except Exception as e:
            return (False, str(e))
    
            


    def save_new_race(self, playerRace: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                INSERT INTO races (name, content) VALUES (?, ?);
                """
                
            conn.execute(com, (playerRace.get('race',''), json.dumps(playerRace)))
            conn.commit()
            
            return (True, "Race added successfully")
        except Exception as e:
            return (False, str(e)) 