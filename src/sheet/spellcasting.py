class Spell():
    
    def __init__(self, name: str = "", level: int = 0, school: str = "", casting_time: str = "",
                 range_: str = "", components: str = "", duration: str = "", description: str = "",
                 is_ritual: bool = False, is_concentration: bool = False):
        self.name = name
        self.description = description
        
        self.level = level
        self.casting_time = casting_time
        self.range_ = range_
        self.components = components
        self.duration = duration
        
        self.school = school
        self.is_ritual = is_ritual
        self.is_concentration = is_concentration
        
    def jsonify(self):
        """Convert the Spell object into a JSON-serializable dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "level": self.level,
            "casting_time": self.casting_time,
            "range": self.range_,
            "components": self.components,
            "duration": self.duration,
            "school": self.school,
            "is_ritual": self.is_ritual,
            "is_concentration": self.is_concentration   
        }
        
    def load_from_dict(self, data: dict):
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.level = data.get("level", 0)
        self.casting_time = data.get("casting_time", "")
        self.range_ = data.get("range", "")
        self.components = data.get("components", "")
        self.duration = data.get("duration", "")
        self.school = data.get("school", "")
        self.is_ritual = data.get("is_ritual", False)
        self.is_concentration = data.get("is_concentration", False)
        return self

class Spellcasting:
    def __init__(self, level: int = -1):
        self.level = level
        self.spell_slots = {}
        self.max_level_spellslots = 9
        self.spells_known = []
        self.spellcasting_ability = None

    def jsonify(self):
        """Convert the Spellcasting object into a JSON-serializable dictionary."""
        return {
            "level": self.level,
            "max_level_spellslots": self.max_level_spellslots,
            "spell_slots": self.spell_slots,
            "spells_known": [spell.jsonify() for spell in self.spells_known],
            "spellcasting_ability": self.spellcasting_ability
        }

    def load_from_dict(self, data: dict):
        self.level = data.get("level", 1)
        self.spell_slots = data.get("spell_slots", {})
        self.max_level_spellslots = data.get("max_level_spellslots", 9)
        self.spells_known = [Spell().load_from_dict(spell_data) for spell_data in data.get("spells_known", [])]
        self.spellcasting_ability = data.get("spellcasting_ability", None)
        return self