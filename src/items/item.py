from typing import List
from misc.feature import ItemFeature

class Item():
    """This class will hold the representation of a DnD item. It will contain methods to create and get information from an item."""

    def __init__(self, name: str = "", description: str = "", weight: float = 0.0, cost : float = 0.0, features: List[ItemFeature] = []):
        self.name = name
        self.description = description
        self.weight = weight
        self.cost = cost
        self.features = features #Dis. on stealth, STR requirements
        
        self.selected = False # For starting equipment selection
    def jsonify(self):
        """Convert the Item object into a JSON-serializable dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "weight": self.weight,
            "cost": self.cost,
            "features": [feature.jsonify() for feature in self.features],
            "selected": self.selected
        }
        
    def load_from_dict(self, data: dict):
        """Load item data from a dictionary."""
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.weight = data.get("weight", 0.0)
        self.cost = data.get("cost", 0.0)
        self.features = [ItemFeature().load_from_dict(f) for f in data.get("features", [])]
        return self

class Attack():
    def __init__(self, damage: str = "", damage_type: List[str] = []):
        self.damage = damage
        self.damage_type = damage_type # Slashing, Piercing, Bludgeoning, Fire, Cold, etc...

    def jsonify(self):
        return {
            "damage": self.damage,
            "damage_type": self.damage_type
        }
class Weapon(Item):
    
    def __init__(self, name: str = "", description: str = "", weight: float = 0.0, cost : float = 0.0, features: List[ItemFeature] = [], attacks : List[Attack] = [], range : str = "", properties: List[str] = []):
        super().__init__(name, description, weight, cost, features)
        
        self.range = range # Melee, Ranged (120ft/60ft/etc...)
        self.attacks = attacks
        self.properties = properties #finesse, heavy, light, loading, range, reach, special, thrown, two-handed, versatile
        
    def jsonify(self):
        
        data = super().jsonify()
        data.update({
            "attacks": [attack.jsonify() for attack in self.attacks],
            "range": self.range,
            "properties": self.properties
        })
        return data
    
class Armor(Item):
    
    def __init__(self, name: str = "", description: str = "", weight: float = 0.0,cost : float = 0.0, features: List[ItemFeature] = [], armor_class: int = 0, armor_type: str = "", stealth_disadvantage: bool = False, strength_requirement: int = 0):
        super().__init__(name, description, weight, cost, features)
        self.armor_class = armor_class
        self.armor_type = armor_type #light, medium, heavy, shield
        self.stealth_disadvantage = stealth_disadvantage
        self.strength_requirement = strength_requirement
        
    def jsonify(self):
        
        data = super().jsonify()
        data.update({
            "armor_class": self.armor_class,
            "armor_type": self.armor_type,
            "stealth_disadvantage": self.stealth_disadvantage,
            "strength_requirement": self.strength_requirement
        })
        return data
    
class ItemChoice():
    
    def __init__(self, choices: List[List[Item]] = []):
        self.choices = choices

    def jsonify(self):
        return {
            "choices": [[item.jsonify() for item in group] for group in self.choices]
        }