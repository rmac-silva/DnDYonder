from typing import List
from items.item import Item, ItemChoice
from sheet.spellcasting import Spellcasting
from sheet.subclass import Subclass
from utils.enums import ArmorType, WeaponType, ToolTypes, Attributes, Skills
from misc.feature import ClassFeature

class CharacterClass():
    """This class will hold the representation of a DnD class. It will contain methods to create and get information from a class."""
    
    def __init__(self):
        self.class_name = ""
        
        #Healing & HP
        self.hit_dice = "d6"
        self.used_hit_dice = 0
        self.starting_hitpoints = 0
        self.next_hitpoints = 0
        
        #Proficiencies
        self.armor_proficiencies : List[ArmorType] = []
        self.weapon_proficiencies : List[WeaponType] = []
        self.tool_proficiencies : List[ToolTypes] = []
        
        #Proficiency in Saving Throws / Skills
        self.attribute_proficiency : List[Attributes] = []
        self.skill_proficiency : List[Skills] = []
        
        #Number of skill proficiencies to choose from
        self.num_skill_proficiencies = 0
        
        #Starting Equipment
        self.starting_equipment : List[Item] = []
        self.starting_equipment_choices : List[ItemChoice] = []
        
        #Class Features
        self.class_features : List[ClassFeature] = []
        
        # Subclass and Spellcasting
        self.subclass = Subclass()
        self.spellcasting = Spellcasting()
        
        
    def jsonify(self):
        """Convert the CharacterClass object into a JSON-serializable dictionary."""
        return {
            "class_name": self.class_name,
            "hit_dice": self.hit_dice,
            "used_hit_dice": self.used_hit_dice,
            "starting_hitpoints": self.starting_hitpoints,
            "next_hitpoints": self.next_hitpoints,
            "armor_proficiencies": [ap.value for ap in self.armor_proficiencies],
            "weapon_proficiencies": [wp.value for wp in self.weapon_proficiencies],
            "tool_proficiencies": [tp.value for tp in self.tool_proficiencies],
            "attribute_proficiency": [attr.value for attr in self.attribute_proficiency],
            "skill_proficiency": [skill.value for skill in self.skill_proficiency],
            "num_skill_proficiencies": self.num_skill_proficiencies,
            "starting_equipment": [item.jsonify() for item in self.starting_equipment],
            "starting_equipment_choices": [choice.jsonify() for choice in self.starting_equipment_choices],
            "class_features": [feature.jsonify() for feature in self.class_features],
            "spellcasting": self.spellcasting.jsonify(),
            "subclass": self.subclass.jsonify()
        }
        
    def load_from_dict(self, data: dict):
        self.class_name = data.get("class_name", "")
        self.hit_dice = data.get("hit_dice", "1d6")
        self.used_hit_dice = data.get("used_hit_dice", 0)
        self.starting_hitpoints = data.get("starting_hitpoints", 0)
        self.next_hitpoints = data.get("next_hitpoints", 0)
        
        self.armor_proficiencies = [ArmorType(ap) for ap in data.get("armor_proficiencies", [])]
        self.weapon_proficiencies = [WeaponType(wp) for wp in data.get("weapon_proficiencies", [])]
        self.tool_proficiencies = [ToolTypes(tp) for tp in data.get("tool_proficiencies", [])]
        
        self.attribute_proficiency = [Attributes(attr) for attr in data.get("attribute_proficiency", [])]
        self.skill_proficiency = [Skills(skill) for skill in data.get("skill_proficiency", [])]
        self.num_skill_proficiencies = data.get("num_skill_proficiencies", 0)
        self.starting_equipment = [Item(**item) for item in data.get("starting_equipment", [])]
        self.starting_equipment_choices = [ItemChoice(**choice) for choice in data.get("starting_equipment_choices", [])]
        
        self.class_features = [ClassFeature(**feature) for feature in data.get("class_features", [])]
        self.spellcasting = data.get("spellcasting", False)
        self.subclass = data.get("subclass", False)
    
    def get_features(self) -> List[dict]:
        return [feature.__dict__ for feature in self.class_features]
# To create a new class, create a CharacterClass object and fill in the details. 
# This creation will be done through React frontend, then sent to the database 
# Insert them into the classes table in the database (TODO: create this).