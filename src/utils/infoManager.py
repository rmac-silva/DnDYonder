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
        
    def get_available_subclasses(self, classname: str = ""):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name,content FROM subclasses where class_name = ?;
        """
        
        res = conn.execute(com, (classname,)).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for cclass in res:
                formatted_array.append({'c_name': cclass[0], 'c_content': json.loads(cclass[1])})
            return (True, formatted_array)
    
    def get_all_subclasses(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT name,content FROM subclasses;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            formatted_array = []
            for subclass in res:
                formatted_array.append({'sc_name': subclass[0], 'sc_content': json.loads(subclass[1])})
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
            SELECT COUNT(*) FROM weapons WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count > 0:
                return (False, "Weapon with this name already exists")
            
            com = """
            INSERT INTO weapons (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Weapon added successfully")
        
        if(type == 'Armor'):
            
            com = """
            SELECT COUNT(*) FROM armors WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count > 0:
                return (False, "Armor with this name already exists")
            
            com = """
            INSERT INTO armors (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Armor added successfully")
        
        if(type == 'Tool'):
            
            com = """
            SELECT COUNT(*) FROM tools WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count > 0:
                return (False, "Tool with this name already exists")
            
            com = """
            INSERT INTO tools (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Tool added successfully")
        
        if(type == 'Misc.'):
            
            com = """
            SELECT COUNT(*) FROM miscellaneous WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count > 0:
                return (False, "Miscellaneous item with this name already exists")
            
            com = """
            INSERT INTO miscellaneous (name, content) VALUES (?, ?);
            """
            conn.execute(com, (item.get('name',''), json.dumps(item)))
            conn.commit()
            return (True, "Miscellaneous item added successfully")
        else:
             return (False, "Invalid item type")
         
    def edit_item(self, item: dict,type:str) -> tuple[bool, str]:
        
        conn = self.dbm.c().connection
        
        if(type == 'Weapon'):
            com = """
            SELECT COUNT(*) FROM weapons WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count == 0:
                return (False, "Weapon with this name does not exist")
            
            com = """
            UPDATE weapons SET content = ? WHERE name = ?;
            """
            conn.execute(com, (json.dumps(item), item.get('name','')))
            conn.commit()
            return (True, "Weapon edited successfully")
        
        if(type == 'Armor'):
            
            com = """
            SELECT COUNT(*) FROM armors WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count == 0:
                return (False, "Armor with this name does not exist")
            
            com = """
            UPDATE armors SET content = ? WHERE name = ?;
            """
            conn.execute(com, (json.dumps(item), item.get('name','')))
            conn.commit()
            return (True, "Armor edited successfully")
        
        if(type == 'Tool'):
            
            com = """
            SELECT COUNT(*) FROM tools WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count == 0:
                return (False, "Tool with this name does not exist")
            
            com = """
            UPDATE tools SET content = ? WHERE name = ?;
            """
            conn.execute(com, (json.dumps(item), item.get('name','')))
            conn.commit()
            return (True, "Tool edited successfully")
        
        if(type == 'Misc.' or type == 'Other'):
            
            com = """
            SELECT COUNT(*) FROM miscellaneous WHERE name = ?;
            """
            
            count = conn.execute(com, (item.get('name','') ,) ).fetchone()[0]
            if count == 0:
                return (False, "Miscellaneous item with this name does not exist")
            
            com = """
            UPDATE miscellaneous SET content = ? WHERE name = ?;
            """
            conn.execute(com, (json.dumps(item), item.get('name','')))
            conn.commit()
            return (True, "Miscellaneous item edited successfully")
        else:
             return (False, "Invalid item type")
         
         
    def delete_item(self, itemName: str,type:str) -> tuple[bool, str]:
        
        conn = self.dbm.c().connection
        
        if(type == 'Weapon'):
            com = """
            SELECT COUNT(*) FROM weapons WHERE name = ?;
            """
            
            count = conn.execute(com, (itemName ,) ).fetchone()[0]
            if count == 0:
                return (False, "No such weapon exists")
            
            com = """
            DELETE FROM weapons WHERE name = ?;
            """
            conn.execute(com, (itemName, ))
            conn.commit()
            return (True, "Weapon removed successfully")
        
        if(type == 'Armor'):
            
            com = """
            SELECT COUNT(*) FROM armors WHERE name = ?;
            """
            
            count = conn.execute(com, (itemName ,) ).fetchone()[0]
            if count == 0:
                return (False, "No such armor exists")
            
            com = """
            DELETE FROM armors WHERE name = ?;
            """
            conn.execute(com, (itemName, ))
            conn.commit()
            return (True, "Armor removed successfully")
        
        if(type == 'Tool'):
            
            com = """
            SELECT COUNT(*) FROM tools WHERE name = ?;
            """
            
            count = conn.execute(com, (itemName ,) ).fetchone()[0]
            if count == 0:
                return (False, "No such tool exists")
            
            com = """
            DELETE FROM tools WHERE name = ?;
            """
            conn.execute(com, (itemName, ))
            conn.commit()
            return (True, "Tool removed successfully")
        
        if(type == 'Misc.'):
            
            com = """
            SELECT COUNT(*) FROM miscellaneous WHERE name = ?;
            """
            
            count = conn.execute(com, (itemName ,) ).fetchone()[0]
            if count == 0:
                return (False, "No such miscellaneous item exists")
            
            com = """
            DELETE FROM miscellaneous WHERE name = ?;
            """
            conn.execute(com, (itemName, ))
            conn.commit()
            return (True, "Miscellaneous item removed successfully")
        else:
             return (False, "Invalid item type")
         
    def save_new_class(self, playerClass: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                SELECT COUNT(*) FROM classes WHERE name = ?;
            """
            
            count = conn.execute(com, (playerClass.get('class_name','') ,) ).fetchone()[0]
            
            if count > 0:
                return (False, "Class with this name already exists")
            
            com = """
                INSERT INTO classes (name, content) VALUES (?, ?);
                """
                
            conn.execute(com, (playerClass.get('class_name',''), json.dumps(playerClass)))
            conn.commit()
            
            return (True, "Class added successfully")
        except Exception as e:
            return (False, str(e)) 
        
    def save_class_edit(self, playerClass: dict) -> tuple[bool, str]:
        
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                SELECT COUNT(*) FROM classes WHERE name = ?;
            """
            
            count = conn.execute(com, (playerClass.get('class_name','') ,) ).fetchone()[0]
            
            if count == 0:
                return (False, "Class with this name does not exist")
            
            com = """
                UPDATE classes SET content = ? WHERE name = ?;
                """
                
            conn.execute(com, (json.dumps(playerClass), playerClass.get('class_name','')))
            conn.commit()
            
            return (True, "Class added successfully")
        except Exception as e:
            return (False, str(e)) 
        
    def save_new_subclass(self, playerClass: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                INSERT INTO subclasses (name, class_name, content) VALUES (?, ?, ?);
                """

            conn.execute(com, (playerClass.get('name',''), playerClass.get('class_name',''), json.dumps(playerClass)))
            conn.commit()

            return (True, "Subclass added successfully")
        except Exception as e:
            return (False, str(e))
        
    def save_subclass_edit(self, playerClass: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                UPDATE subclasses SET content = ?, name = ? WHERE name = ? AND class_name = ?;
                """

            conn.execute(com, (json.dumps(playerClass), playerClass.get('name',''), playerClass.get('old_subclass_name',''), playerClass.get('class_name','')))
            conn.commit()

            return (True, "Subclass edited successfully")
        except Exception as e:
            return (False, str(e))
    
    def delete_subclass(self, subclassName: str,className : str) -> tuple[bool, str]:
        print("[infoManager.py] Deleting subclass:", subclassName, "of class:", className)
        try:
            conn = self.dbm.c().connection
            
            com = """
                DELETE FROM subclasses WHERE name = ? AND class_name = ?;
                """

            conn.execute(com, (subclassName, className))
            conn.commit()

            return (True, "Subclass deleted successfully")
        except Exception as e:
            return (False, str(e))
    
    def save_new_spell(self, spell: dict) -> tuple[bool, str]:
        
        try:
            
            conn = self.dbm.c().connection
            
            com = """
                SELECT COUNT(*) FROM spells WHERE name = ?;
            """
            
            count = conn.execute(com, (spell.get('name','').strip().lower() ,) ).fetchone()[0]
            if count > 0:
                return (False, "Spell with this name already exists")

            com = """
                INSERT INTO spells (name, content) VALUES (?, ?);
                """

            conn.execute(com, (spell.get('name','').strip().lower(), json.dumps(spell)))
            conn.commit()

            return (True, "Spell added successfully")
        except Exception as e:
            return (False, str(e))
        
    def update_spell(self, spell: dict) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection

            com = """
                UPDATE spells SET content = ? WHERE name = ?;
                """

            conn.execute(com, (json.dumps(spell), spell.get('name','')))
            conn.commit()

            return (True, "Spell added successfully")
        except Exception as e:
            return (False, str(e))
        
    def delete_spell(self, spellName: str) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection

            com = """
                DELETE FROM spells WHERE name = ?;
                """

            conn.execute(com, (spellName,))
            conn.commit()

            return (True, "Spell deleted successfully")
        except Exception as e:
            return (False, str(e))

    def save_new_race(self, playerRace: dict) -> tuple[bool, str]:
        try:
            race_name = playerRace.get('subrace','') + " " + playerRace.get('race','')
            
            if(race_name.strip() == ""):
                return (False, "Race name cannot be empty")
            
            com = """
                SELECT COUNT(*) FROM races WHERE name = ?;
            """
            
            count = self.dbm.c().connection.execute(com, (race_name ,) ).fetchone()[0]
            
            if count > 0:
                return (False, f"Race with the name {race_name} already exists")
            
            conn = self.dbm.c().connection
            
            com = """
                INSERT INTO races (name, content) VALUES (?, ?);
                """

            conn.execute(com, (race_name, json.dumps(playerRace)))
            conn.commit()
            
            return (True, "Race added successfully")
        except Exception as e:
            return (False, str(e)) 
        
    def delete_race(self, raceName:str) -> tuple[bool, str]:
        try:
            
            conn = self.dbm.c().connection

            com = """
            DELETE FROM Races where name = ?;
            """
            
            conn.execute(com, (raceName,))
            conn.commit()
            
            return (True, "Race deleted successfully")
        except Exception as e:
            return (False, str(e))
        
    def save_race_edit(self, playerRace: dict) -> tuple[bool, str]:
        try:    
            conn = self.dbm.c().connection
            
            com = """
            UPDATE Races SET content = ?, name = ? WHERE name = ?;
            """
            
            conn.execute(com, (json.dumps(playerRace), playerRace.get('subrace','') + " " + playerRace.get('race',''), playerRace.get('old_name','')))
            conn.commit()
            return (True, "Race edited successfully")
        except Exception as e:
            return (False, str(e))