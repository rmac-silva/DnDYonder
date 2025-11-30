class Spell():
    
    def __init__(self, name: str = "", level: int = 0, school: str = "", casting_time: str = "",
                 range_: str = "", components: str = "", duration: str = "", description: str = "",
                 is_ritual: bool = False):
        self.name = name
        self.description = description
        
        self.level = level
        self.casting_time = casting_time
        self.range_ = range_
        self.components = components
        self.duration = duration
        
        self.school = school
        self.is_ritual = is_ritual

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
            "spells_known": self.spells_known,
            "spellcasting_ability": self.spellcasting_ability
        }

    def load_from_dict(self, data: dict):
        self.level = data.get("level", 1)
        self.spell_slots = data.get("spell_slots", {})
        self.max_level_spellslots = data.get("max_level_spellslots", 9)
        self.spells_known = data.get("spells_known", [])
        self.spellcasting_ability = data.get("spellcasting_ability", None)
        return self