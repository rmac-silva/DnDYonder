from utils.enums import ToolTypes, Skills
from items.item import Item
from misc.feature import BackgroundFeature
from typing import List

class CharacterBackground():
    def __init__(self):
        self.background = ""
        self.skill_proficiency : List[Skills] = []
        self.tool_proficiency : List[ToolTypes] = []
        #Starting Equipment
        self.starting_equipment : List[Item] = []
        #Features
        self.background_features : List[BackgroundFeature] = []

    def jsonify(self):
        return {
            "background": self.background,
            "skill_proficiency": [sp.value for sp in self.skill_proficiency],
            "tool_proficiency": [tp.value for tp in self.tool_proficiency],
            "starting_equipment": [item.jsonify() for item in self.starting_equipment],
            "background_features": [bf.jsonify() for bf in self.background_features]
        }
        
    def load_from_dict(self, data: dict):
        self.background = data.get("background", "")
        self.skill_proficiency = [Skills(sp) for sp in data.get("skill_proficiency", [])]
        self.tool_proficiency = [ToolTypes(tp) for tp in data.get("tool_proficiency", [])]
        self.starting_equipment = [Item().load_from_dict(item) for item in data.get("starting_equipment", [])]
        self.background_features = [BackgroundFeature().load_from_dict(bf) for bf in data.get("background_features", [])]
        return self