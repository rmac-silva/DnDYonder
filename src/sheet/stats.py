
class CharacterStats():
    """This class will hold the base stats of the character sheet, HP, AC, Speed, Level etc..."""
    def __init__(self):
        
        self.level = 1
        self.proficiency_bonus = self.get_proficiency_bonus()
        
        self.armor_class = 10 #TODO - Set based on armor and dexterity modifier (if applicable)
        self.armor_class_temp = 0 #TODO - Set based on armor and dexterity modifier (if applicable)
        self.initiative_bonus = 0 #TODO - Set based on dexterity modifier
        self.speed = 30 #TODO - Set based on race
        
        self.max_hp = 10 #TODO - Set based on class and CON modifier
        self.current_hp = 10 #TODO - Set based on max HP
        self.temporary_hp = 0
        
        #Hit dice
        self.hit_dice = "1d6" #TODO - Set based on class
        self.max_hit_dice = self.level #TODO - Set based on level
        self.current_hit_dice = 0
        
        #Death saves
        self.death_saves_success = 0
        self.death_saves_failure = 0
        
        #Add more stats here
        
    def get_proficiency_bonus(self):
        """Calculate proficiency bonus based on level."""
        if self.level >= 1 and self.level <= 4:
            return 2
        elif self.level >= 5 and self.level <= 8:
            return 3
        elif self.level >= 9 and self.level <= 12:
            return 4
        elif self.level >= 13 and self.level <= 16:
            return 5
        elif self.level >= 17 and self.level <= 20:
            return 6
        else:
            return 0
            
    def set_max_hp(self, hp):
        """Set the maximum HP and adjust current HP if necessary."""
        self.max_hp = hp
    
    def jsonify(self):
        return {
            "level": self.level,
            "proficiency_bonus": self.get_proficiency_bonus(),
            "armor_class": self.armor_class,
            "armor_class_temp": self.armor_class_temp,
            "initiative_bonus": self.initiative_bonus,
            "speed": self.speed,
            "max_hp": self.max_hp,
            "current_hp": self.current_hp,
            "temporary_hp": self.temporary_hp,
            "hit_dice": self.hit_dice,
            "max_hit_dice": self.max_hit_dice,
            "current_hit_dice": self.current_hit_dice,
            "death_saves_success": self.death_saves_success,
            "death_saves_failure": self.death_saves_failure
        }
        
    def load_from_dict(self, data: dict):
        self.level = data.get("level", 1)
        self.proficiency_bonus = self.get_proficiency_bonus()
        self.armor_class = data.get("armor_class", 10)
        self.armor_class_temp = data.get("armor_class_temp", 0)
        self.initiative_bonus = data.get("initiative_bonus", 0)
        self.speed = data.get("speed", 30)
        self.max_hp = data.get("max_hp", 10)
        self.current_hp = data.get("current_hp", 10)
        self.temporary_hp = data.get("temporary_hp", 0)
        self.hit_dice = data.get("hit_dice", "1d6")
        self.max_hit_dice = data.get("max_hit_dice", self.level)
        self.current_hit_dice = data.get("current_hit_dice", 0)
        self.death_saves_success = data.get("death_saves_success", 0)
        self.death_saves_failure = data.get("death_saves_failure", 0)