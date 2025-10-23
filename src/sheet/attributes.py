from utils.enums import Skills,Attributes

class Skill():
    """A skill on the character sheet."""
    
    def __init__(self, name: Skills, value: int = 0, proficient: bool = False, expertise: bool | None = False):
        self.name = name
        self.value = value
        self.locked = False
        self.proficient = proficient
        self.expertise = expertise

    def jsonify(self):
        return {
            "name": self.name.value,
            "value": self.value,
            "proficient": self.proficient,
            "expertise": self.expertise,
            "has_expertise": False if self.expertise is None else True,
            "locked": self.locked
        }

class Attribute():
    """An attribute on the character sheet. It holds the value and the respective skills of said attribute."""
    
    def __init__(self, name: Attributes, value: int = 10, skills: list[Skill] = []):
        self.name = name
        self.value = value
        self.skills : list[Skill] = skills
    
    def jsonify(self):
        return {
            "name": self.name,
            "value": self.value,
            "skills": [skill.jsonify() for skill in self.skills]
        }

class CharacterAttributes():
    """The player attributes section of the character sheet."""
    
    def __init__(self):
        self.Strength = Attribute(Attributes.STR,skills=[Skill(Skills.STRENGTH_SAVING_THROW,expertise=None),Skill(Skills.ATHLETICS)])
        self.Dexterity = Attribute(Attributes.DEX,skills=[Skill(Skills.DEXTERITY_SAVING_THROW,expertise=None),Skill(Skills.ACROBATICS),Skill(Skills.SLEIGHT_OF_HAND),Skill(Skills.STEALTH)])
        self.Constitution = Attribute(Attributes.CON,skills=[Skill(Skills.CONSTITUTION_SAVING_THROW,expertise=None)])
        self.Intelligence = Attribute(Attributes.INT,skills=[Skill(Skills.INTELLIGENCE_SAVING_THROW,expertise=None),Skill(Skills.ARCANA),Skill(Skills.HISTORY),Skill(Skills.INVESTIGATION),Skill(Skills.NATURE),Skill(Skills.RELIGION)])
        self.Wisdom = Attribute(Attributes.WIS,skills=[Skill(Skills.WISDOM_SAVING_THROW,expertise=None),Skill(Skills.ANIMAL_HANDLING),Skill(Skills.INSIGHT),Skill(Skills.MEDICINE),Skill(Skills.PERCEPTION),Skill(Skills.SURVIVAL)])
        self.Charisma = Attribute(Attributes.CHA,skills=[Skill(Skills.CHARISMA_SAVING_THROW,expertise=None),Skill(Skills.DECEPTION),Skill(Skills.INTIMIDATION),Skill(Skills.PERFORMANCE),Skill(Skills.PERSUASION)])
    
    def jsonify(self):
        return {
            "Strength": self.Strength.jsonify(),
            "Dexterity": self.Dexterity.jsonify(),
            "Constitution": self.Constitution.jsonify(),
            "Intelligence": self.Intelligence.jsonify(),
            "Wisdom": self.Wisdom.jsonify(),
            "Charisma": self.Charisma.jsonify()
        }
    
    def load_from_dict(self, data: dict):
        
        attr_data = data["Strength"]
        self.Strength.value = attr_data.get("value", 10)
        self.Strength.skills = [Skill(Skills(skill["name"]), skill["value"], skill["proficient"], skill.get("expertise")) for skill in attr_data.get("skills", [])]
    
        attr_data = data["Dexterity"]
        self.Dexterity.value = attr_data.get("value", 10)
        self.Dexterity.skills = [Skill(Skills(skill["name"]), skill["value"], skill["proficient"], skill.get("expertise")) for skill in attr_data.get("skills", [])]
    
        attr_data = data["Constitution"]
        self.Constitution.value = attr_data.get("value", 10)
        self.Constitution.skills = [Skill(Skills(skill["name"]), skill["value"], skill["proficient"], skill.get("expertise")) for skill in attr_data.get("skills", [])]
    
        attr_data = data["Intelligence"]
        self.Intelligence.value = attr_data.get("value", 10)
        self.Intelligence.skills = [Skill(Skills(skill["name"]), skill["value"], skill["proficient"], skill.get("expertise")) for skill in attr_data.get("skills", [])]
    
        attr_data = data["Wisdom"]
        self.Wisdom.value = attr_data.get("value", 10)
        self.Wisdom.skills = [Skill(Skills(skill["name"]), skill["value"], skill["proficient"], skill.get("expertise")) for skill in attr_data.get("skills", [])]
    
        attr_data = data["Charisma"]
        self.Charisma.value = attr_data.get("value", 10)
        self.Charisma.skills = [Skill(Skills(skill["name"]), skill["value"], skill["proficient"], skill.get("expertise")) for skill in attr_data.get("skills", [])]