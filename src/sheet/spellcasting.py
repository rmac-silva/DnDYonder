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