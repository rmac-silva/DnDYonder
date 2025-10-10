class Feature():
    """This class will hold the representation of a DnD feature."""
    
    def __init__(self):
        self.name = ""
        self.description = ""
        self.prerequisites = []
        self.benefits = []

    def jsonify(self):
        """Convert the Feature object into a JSON-serializable dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "prerequisites": self.prerequisites,
            "benefits": self.benefits
        }
        
    def load_from_dict(self, data: dict):
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.prerequisites = data.get("prerequisites", [])
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