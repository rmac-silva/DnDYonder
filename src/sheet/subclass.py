from typing import List
from misc.feature import ClassFeature

class Subclass:
    def __init__(self, name: str = "", description: str = "", level: int = -1, features: List[ClassFeature] = []):
        self.name = name
        self.description = description
        self.level = level
        self.features = features
        self.selected = False
        
        
    
    def jsonify(self):
        """Convert the Subclass object into a JSON-serializable dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "level": self.level,
            "features": [feature.__dict__ for feature in self.features],
            "selected": self.selected
        }
    
    def load_from_dict(self, data: dict):
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.level = data.get("level", 1)
        self.features = [ClassFeature(**feature) for feature in data.get("features", [])]
        self.selected = data.get("selected", False)