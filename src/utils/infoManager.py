from utils.db_manager import DatabaseManager


class InfoManager():
    
    def __init__(self, dbm: DatabaseManager):
        self.dbm = dbm
        
    def get_available_classes(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT * FROM classes;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            return (True, res)
        
    def get_available_weapons(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT * FROM weapons;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            return (True, res)
        
    def get_available_tools(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT * FROM tools;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            return (True, res)
        
    def get_available_armors(self):
        conn = self.dbm.c().connection
        
        com = """
        SELECT * FROM armors;
        """
        
        res = conn.execute(com).fetchall()
        
        if res is None:
            return (True, [])
        else:
            return (True, res)
        
    def get_all_equipment(self):
        items_merged = []
        
        weapons = self.get_available_weapons()
        if weapons[0]:
            items_merged.extend(weapons[1])
            
        tools = self.get_available_tools()
        if tools[0]:
            items_merged.extend(tools[1])
            
        return (True,items_merged) 
        
    def get_class_features(self, playerClass: str):
        conn = self.dbm.c().connection
        
        com = """
        SELECT * FROM class_features
        WHERE class_name = ?;
        """
        
        res = conn.execute(com, (playerClass,)).fetchall()
        
        if res is None:
            return (True, [])
        else:
            return (True, res)