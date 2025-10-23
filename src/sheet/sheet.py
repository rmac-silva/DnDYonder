"""This class will hold the representation of a whole sheet. It will contain all the data and methods to manipulate it."""

from sheet.stats import CharacterStats
from sheet.cclass import CharacterClass
from sheet.attributes import CharacterAttributes
from sheet.race import CharacterRace
from sheet.background import CharacterBackground
from sheet.miscellaneousInfo import MiscellaneousInfo
     
# This class will be initialized to create a new sheet. Further changes to it (health, AC etc... will be saved afterwards)


class CharacterSheet():
    
    def __init__(self):
        
        # Sheet ID
        self.id = 0
        
        #Character name
        self.name = ""
        
        self.background = CharacterBackground()
        self.race = CharacterRace()
        self.cclass = CharacterClass()
        self.attributes = CharacterAttributes()
        self.stats = CharacterStats() # Variable stats like HP, AC, Speed, Level etc...
        self.misc = MiscellaneousInfo()
        
    def jsonify(self):
        return {
            "id": self.id,
            "name": self.name,
            "race": self.race.jsonify(),
            "class":self.cclass.jsonify(),
            "background": self.background.jsonify(),
            "attributes": self.attributes.jsonify(),
            "stats": self.stats.jsonify(),
            "misc": self.misc.jsonify()
        }
        
    def load_from_dict(self, data: dict):
        self.id = data.get("id", 0)
        self.name = data.get("name", "")
        self.background.load_from_dict(data.get("background", {}))
        self.race.load_from_dict(data.get("race", {}))
        self.cclass.load_from_dict(data.get("class", {}))
        self.attributes.load_from_dict(data.get("attributes", {}))
        self.stats.load_from_dict(data.get("stats", {}))
        self.misc.load_from_dict(data.get("misc", {}))