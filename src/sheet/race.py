from typing import List
from misc.feature import RaceFeature
from utils.enums import Languages

class CharacterRace():
    """This class will hold the representation of a DnD race."""
    
    def __init__(self):
        
        self.race = ""
        self.creature_type = ""
        self.size = ""
        self.alignment = ""
        self.speed = 30
        self.languages: List[Languages] = []
        self.race_features : List[RaceFeature] = []
    
    def jsonify(self):
        """Convert the CharacterRace object into a JSON-serializable dictionary."""
        return {
            "race" : self.race,
            "creature_type": self.creature_type,
            "size": self.size,
            "alignment": self.alignment,
            "speed": self.speed,
            "race_features": [f.jsonify() for f in self.race_features]
        }
        
    def load_from_dict(self, data: dict):
        self.race = data.get("race", "")
        self.creature_type = data.get("creature_type", "")
        self.size = data.get("size", "")
        self.alignment = data.get("alignment", "")
        self.speed = data.get("speed", 30)
        self.languages = [Languages(lang) for lang in data.get("languages", [])]
        self.race_features = [RaceFeature().load_from_dict(f) for f in data.get("race_features", [])]
        return self