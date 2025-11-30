
from sheet.attributes import CharacterAttributes, Skill
from sheet.cclass import CharacterClass
from sheet.sheet import CharacterSheet
from sheet.stats import CharacterStats
import math
from typing import List
divider = "--------------------------------------------------------------------\n"


def ExportAsText(data: dict):
    sheet = CharacterSheet().load_from_dict(data)
    
    output_string = ""
        
    output_string += ("```\n")
    output_string += (f"{divider}{divider}")
    output_string += (f"{sheet.name} || {sheet.race.alignment} {sheet.race.race} {sheet.cclass.class_name}[{sheet.stats.level}] \n{divider}{divider}\n")
    output_string += (f"{PrintStats(sheet.stats)}\n\n")
    output_string += (f"{divider}{divider}\n")
    output_string += (f"ATTRIBUTES:\n\n{PrintAttributes(sheet.attributes)}")
    output_string += (f"\nSPELL LIST\n\n{PrintClass(sheet.cclass)}")
    output_string += ("\n\n```")
        
    return output_string

def PrintStats(data: CharacterStats):
    if data.armor_class_temp == 0:
        temp_ac = ""
    else:
        temp_ac = f"+{data.armor_class_temp}"

    string = f"HEALTH: {data.current_hp}/{data.max_hp} || AC: {data.armor_class}{temp_ac} || INITIATIVE: {data.initiative_bonus} || SPEED: {data.speed}"
    return string

def PrintAttributes(data: CharacterAttributes):
    attributes = []
    modifiers = []
    saves = []
    skill_name = []
    skill_value = []
    attributelist = ["Strength","Dexterity","Constitution","Intelligence","Wisdom","Charisma"]
    string1 = "" # Atributes, modifiers and saves
    string2 = "" # Skills
    gigastring = ""

    for attribute in attributelist: ## Populate Attribute List 
        attributes.append(getattr(data, attribute).value)
        skill_list : List[Skill] = getattr(data, attribute).skills
        for skill in skill_list:
            if skill == skill_list[0]:
                saves.append(skill.value)

            else:
                skill_name.append(skill.name.value)
                skill_value.append(skill.value)
        
    
    for i in range(len(attributes)):## Populate Modifiers List
        modifier = math.floor((attributes[i]-10)/2)
        modifiers.append(modifier)
    

    for i in range(len(attributes)): ## Assemble String Block
        string1 += f"{attributelist[i].upper()}: {attributes[i]} || MOD: {positivizer(modifiers[i])} || SAVE: {positivizer(saves[i])}\n"
    
    for i in range(len(skill_name)):

        string2 += f"{skill_name[i].upper()}: {positivizer(skill_value[0])}\n"
    gigastring= f"{string1}\n{divider}\nSKILLS:\n\n{string2}\n{divider}{divider}"
    
    return gigastring

def PrintClass(data: CharacterClass):
    spell_codex = data.spellcasting.spells_known
    spell_list = []
    for spell in spell_codex:
        spell_list.append(f"[{spell.get("level")}]{spell.get("name")}")
    sorted_spell_list = sorted(spell_list, key=lambda s: int(s[1]))
    return "\n".join(sorted_spell_list)


def positivizer(value): # Adds + behind value if it isn't negative
    if value >= 0:
        return f"+{value}"
    else:
        return value