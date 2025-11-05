class CharacterInfo():

    def __init__(self, age : str = "", height : str = "", weight : str = "", distinguishing_marks : str = "", eyes : str = "", skin : str = "", hair : str = "", scars : str = ""):
        self.age = age
        self.height = height
        self.weight = weight
        self.distinguishing_marks = distinguishing_marks
        self.eyes = eyes
        self.skin = skin
        self.hair = hair
        self.scars = scars
        
    def jsonify(self):
        return {
            "age": self.age,
            "height": self.height,
            "weight": self.weight,
            "distinguishing_marks": self.distinguishing_marks,
            "eyes": self.eyes,
            "skin": self.skin,
            "hair": self.hair,
            "scars": self.scars
        }
        
    def load_from_dict(self, data: dict):
        self.age = data.get("age", "")
        self.height = data.get("height", "")
        self.weight = data.get("weight", "")
        self.distinguishing_marks = data.get("distinguishing_marks", "")
        self.eyes = data.get("eyes", "")
        self.skin = data.get("skin", "")
        self.hair = data.get("hair", "")
        self.scars = data.get("scars", "")
        return self
        