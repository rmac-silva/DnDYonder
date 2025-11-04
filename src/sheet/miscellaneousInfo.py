from typing import List

class PropertyTracker:
    
    def __init__(self) -> None:
        self.name = ""
        self.value = 0
        self.max_value = 0
        
    def jsonify(self):
        return {
            "name": self.name,
            "value": self.value,
            "max_value": self.max_value
        }
        
    def load_from_dict(self, data: dict):
        self.name = data.get("name", "")
        self.value = data.get("value", 0)
        self.max_value = data.get("max_value", 0)
        return self

class MiscellaneousInfo:
    
    def __init__(self):
        self.proficiencies = []  # List of proficiencies (strings)
        self.trackers : List[PropertyTracker]= []
        self.inventory : List[str] = [] # Save the item names, to fetch more information consult the backend.
        self.attacks : List[dict] = []
        
        #Anything else that doesn't fit in other categories can go here.
        
    def jsonify(self):
        return {
            "proficiencies": self.proficiencies,
            "trackers": [tracker.jsonify() for tracker in self.trackers],
            "inventory": self.inventory,
            "attacks": self.attacks,
            
        }
    
    def load_from_dict(self, data: dict):
        self.proficiencies = data.get("proficiencies", [])
        self.trackers = [PropertyTracker().load_from_dict(t) for t in data.get("trackers", [])]
        self.inventory = data.get("inventory", [])
        self.attacks = data.get("attacks", [])
        
        return self