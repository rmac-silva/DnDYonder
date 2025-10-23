class MiscellaneousInfo:
    
    def __init__(self):
        self.proficiencies = []  # List of proficiencies (strings)
        #Anything else that doesn't fit in other categories can go here.
        
    def jsonify(self):
        return {
            "proficiencies": self.proficiencies
        }
    
    def load_from_dict(self, data: dict):
        self.proficiencies = data.get("proficiencies", [])