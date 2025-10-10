from typing import List
from misc.feature import ItemFeature

class Item():
    """This class will hold the representation of a DnD item. It will contain methods to create and get information from an item."""

    def __init__(self, name: str = "", description: str = "", weight: float = 0.0, features: List[ItemFeature] = []):
        self.name = name
        self.description = description
        self.weight = weight
        self.features = features #Dis. on stealth, STR requirements
        
    def jsonify(self):
        """Convert the Item object into a JSON-serializable dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "weight": self.weight,
            "features": [feature.jsonify() for feature in self.features]
        }
        
    def load_from_dict(self, data: dict):
        """Load item data from a dictionary."""
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.weight = data.get("weight", 0.0)
        self.features = [ItemFeature().load_from_dict(f) for f in data.get("features", [])]
        return self