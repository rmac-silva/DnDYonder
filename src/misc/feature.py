class Feature():
    """This class will hold the representation of a DnD feature."""
    
    def __init__(self):
        self.name = ""
        self.description = ""
        self.level_requirement = 0
        self.benefits = [] #This will somehow have to be hard-coded.
        
        # For example, Druids get their druid circle feature at level 2.
        # When a druid reaches level 2, this feature should automatically prompt the 
        # user to select a druid circle.
        # So a tag for SUBCLASS_SELECTION?? Discuss this later.

    def jsonify(self):
        """Convert the Feature object into a JSON-serializable dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "level_requirement": self.level_requirement,
            "benefits": self.benefits
        }
        
    def load_from_dict(self, data: dict):
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.level_requirement = data.get("level_requirement", 0)
        self.benefits = data.get("benefits", [])
        return self
    
class RaceFeature(Feature):
    """This class will hold the representation of a race feature.
    This only exists if there's any specifics later"""
    
class ClassFeature(Feature):
    """This class will hold the representation of a class feature.
    This only exists if there's any specifics later"""
    
class ItemFeature(Feature):
    """This class will hold the representation of an item feature.
    This only exists if there's any specifics later"""
    
class BackgroundFeature(Feature):
    """This class will hold the representation of a background feature.
    This only exists if there's any specifics later"""