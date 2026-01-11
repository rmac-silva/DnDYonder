from typing import List
from misc.feature import RaceFeature
from utils.enums import Language, ToolTypes, ArmorType

class CharacterRace():
    """This class will hold the representation of a DnD race."""
    
    def __init__(self):
        
        self.race = ""
        self.subrace = ""
        self.creature_type = ""
        self.size = ""
        self.alignment = ""
        self.speed = 30
        self.languages: List[Language] = []
        self.race_features : List[RaceFeature] = []
        
        self.armor_proficiencies : List[ArmorType] = []
        self.weapon_proficiencies : List[str] = []
        self.tool_proficiencies : List[ToolTypes] = []
    
    def jsonify(self):
        """Convert the CharacterRace object into a JSON-serializable dictionary."""
        return {
            "race" : self.race,
            "subrace": self.subrace,
            "creature_type": self.creature_type,
            "size": self.size,
            "alignment": self.alignment,
            "speed": self.speed,
            "race_features": [f.jsonify() for f in self.race_features]
        }
        
    def load_from_dict(self, data: dict):
        self.race = data.get("race", "")
        self.subrace = data.get("subrace", "")
        self.creature_type = data.get("creature_type", "")
        self.size = data.get("size", "")
        
        self.speed = data.get("speed", 30)
        self.languages = [Language(lang) for lang in data.get("languages", [])]
        self.race_features = [RaceFeature().load_from_dict(f) for f in data.get("race_features", [])]
        self.alignment = data.get("alignment", "")
        self.armor_proficiencies = [ArmorType(ap) for ap in data.get("armor_proficiencies", [])]
        self.weapon_proficiencies = [str(wp) for wp in data.get("weapon_proficiencies", [])]
        self.tool_proficiencies = [ToolTypes(tp) for tp in data.get("tool_proficiencies", [])]
        return self