"""This file will generate the database and tables if they do not exist yet.
"""

import sqlite3
import json

def setup_database(db_path : str):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Create tables if they do not exist
    create_users_table(c)
    create_sheets_table(c)
    create_classes_table(c)
    create_subclasses_table(c)
    create_spells_table(c)
    create_races_table(c)
    create_weapons_table(c)
    create_tools_table(c)
    create_miscellaneous_table(c)
    create_armors_table(c)
    
    conn.commit()
    conn.close()

def create_users_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
        username TEXT NOT NULL UNIQUE
        );'''
    )
    
def create_sheets_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS sheets (
        sheet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY(username) REFERENCES users(username)
        );''')
    
def create_classes_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS classes (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_subclasses_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS subclasses (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_spells_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS spells (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_races_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS races (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_weapons_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS weapons (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_tools_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS tools (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_miscellaneous_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS miscellaneous (
        name TEXT NOT NULL,
        content TEXT
        );''')
    
def create_armors_table(c):
    c.execute('''
        CREATE TABLE IF NOT EXISTS armors (
        name TEXT NOT NULL,
        content TEXT
        );''')
    

    
# setup_database()

json_to_update = {
  "class_name": "Ranger",
  "hit_die": "d10",
  "starting_hitpoints": "10",
  "hitpoints_per_level": "6",
  "armor_proficiencies": [
    "Light Armor",
    "Medium Armor",
    "Shields"
  ],
  "weapon_proficiencies": [
    "Simple Weapons",
    "Martial Weapons"
  ],
  "tool_proficiencies": [],
  "attribute_proficiencies": [
    "Strength",
    "Dexterity"
  ],
  "skill_proficiencies": [
    "Animal Handling",
    "Athletics",
    "Insight",
    "Investigation",
    "Nature",
    "Perception",
    "Stealth",
    "Survival"
  ],
  "starting_equipment": [
    {
      "name": "Longbow"
    }
  ],
  "starting_equipment_choices": [
    [
      [
        {
          "name": "Scale mail",
          "uid": "1761585858675-ym5ahx"
        }
      ],
      [
        {
          "name": "Leather armor",
          "uid": "1761585863080-u6pyjo"
        }
      ]
    ],
    [
      [
        {
          "name": "Shortsword",
          "uid": "1761585877731-fa1jo8"
        },
        {
          "name": "Shortsword",
          "uid": "1761585878857-mq2174"
        }
      ],
      [
        {
          "name": "Any Simple Weapon",
          "uid": "1761585882584-6aheu0"
        },
        {
          "name": "Any Simple Weapon",
          "uid": "1761585884000-sfqb9s"
        }
      ]
    ],
    [
      [
        {
          "name": "Dungeoneer's pack",
          "uid": "1761585890896-fpe3ct"
        }
      ],
      [
        {
          "name": "Explorer's pack",
          "uid": "1761585894610-kyhlhu"
        }
      ]
    ]
  ],
  "class_features": [
    {
      "name": "Favored Enemy",
      "description": "Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.\n\nChoose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.\n\nYou have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.\n\nWhen you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.\n\nYou choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.",
      "level_requirement": "1",
      "benefits": []
    },
    {
      "name": "Favored Foe (Optional)",
      "description": "This 1st-level feature replaces the Favored Enemy feature and works with the Foe Slayer feature. You gain no benefit from the replaced feature and don't qualify for anything in the game that requires it.\n\nWhen you hit a creature with an attack roll, you can call on your mystical bond with nature to mark the target as your favored enemy for 1 minute or until you lose your concentration (as if you were concentrating on a spell).\n\nThe first time on each of your turns that you hit the favored enemy and deal damage to it, including when you mark it, you increase that damage by 1d4.\n\nYou can use this feature to mark a favored enemy a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\n\nThis feature's extra damage increases when you reach certain levels in this class: to 1d6 at 6th level and to 1d8 at 14th level.",
      "level_requirement": "1",
      "benefits": []
    },
    {
      "name": "Natural Explorer",
      "description": "Also at 1st level, you are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you’re proficient in.\n\nWhile traveling for an hour or more in your favored terrain, you gain the following benefits:\n\nDifficult terrain doesn’t slow your group’s travel.\nYour group can’t become lost except by magical means.\nEven when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.\nIf you are traveling alone, you can move stealthily at a normal pace.\nWhen you forage, you find twice as much food as you normally would.\nWhile tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.\n\nYou choose additional favored terrain types at 6th and 10th level.",
      "level_requirement": "1",
      "benefits": []
    },
    {
      "name": "Deft Explorer (Optional)",
      "description": "This 1st-level feature replaces the Natural Explorer feature. You gain no benefit from the replaced feature and don't qualify for anything in the game that requires it.\n\nYou are an unsurpassed explorer and survivor, both in the wilderness and in dealing with others on your travels. You gain the Canny benefit below, and you gain an additional benefit when you reach 6th level and 10th level in this class.\n\nCanny (1st Level)\nChoose one of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make using the chosen skill.\n\nYou can also speak, read, and write 2 additional languages of your choice.\n\nRoving (6th Level)\nYour walking speed increases by 5, and you gain a climbing speed and a swimming speed equal to your walking speed.\n\nTireless (10th Level)\nAs an action, you can give yourself a number of temporary hit points equal to 1d8 + your Wisdom modifier (minimum of 1 temporary hit point). You can use this action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.\n\nIn addition, whenever you finish a short rest, your exhaustion level, if any, is decreased by 1.",
      "level_requirement": "1",
      "benefits": []
    },
    {
      "name": "Fighting Style",
      "description": "At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again.\n\nArchery. You gain a +2 bonus to attack rolls you make with ranged weapons.\nBlind Fighting. You have blind sight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.\nDefense. While you are wearing armor, you gain a +1 bonus to AC.\nDruidic Warrior. You learn two cantrips of your choice from the Druid spell list. They count as ranger spells for you, and Wisdom is your spellcasting ability for them. Whenever you gain a level in this class, you can replace one of these cantrips with another cantrip from the Druid spell list.\nDueling. When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.\nThrown Weapon Fighting. You can draw a weapon that has the thrown property as part of the attack you make with the weapon.\nIn addition, when you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.\nTwo-Weapon Fighting. When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.\nClose Quarters Shooter (UA). When making a ranged attack while you are within 5 feet of a hostile creature, you do not have disadvantage on the attack roll. Your ranged attacks ignore half cover and three-quarters cover against targets within 30 feet of you. You have a +1 bonus to attack rolls on ranged attacks.\nInterception (UA). When a creature you can see hits a target that is within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your proficiency bonus (to a minimum of 0 damage). You must be wielding a shield or a simple or martial weapon to use this reaction.\nMariner (UA). As long as you are not wearing heavy armor or using a shield, you have a swimming speed and a climbing speed equal to your normal speed, and you gain a +1 bonus to armor class.\nTunnel Fighter (UA). As a bonus action, you can enter a defensive stance that lasts until the start of your next turn. While in your defensive stance, you can make opportunity attacks without using your reaction, and you can use your reaction to make a melee attack against a creature that moves more than 5 feet while within your reach.\nUnarmed Fighting (UA). Your unarmed strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier. If you strike with two free hands, the d6 becomes a d8.\nWhen you successfully start a grapple, you can deal 1d4 bludgeoning damage to the grappled creature. Until the grapple ends, you can also deal this damage to the creature whenever you hit it with a melee attack.",
      "level_requirement": "2",
      "benefits": []
    },
    {
      "name": "Spellcasting",
      "description": "By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does.\n\nSpell Slots\nThe Ranger table shows how many spell slots you have to cast your ranger spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest.\n\nFor example, if you know the 1st-level spell Animal Friendship and have a 1st-level and a 2nd-level spell slot available, you can cast Animal Friendship using either slot.\n\nSpells Known of 1st Level and Higher\nYou know two 1st-level spells of your choice from the ranger spell list.\n\nThe Spells Known column of the Ranger table shows when you learn more ranger spells of your choice. Each of these spells must be of a level for which you have spell slots. For instance, when you reach 5th level in this class, you can learn one new spell of 1st or 2nd level.\n\nAdditionally, when you gain a level in this class, you can choose one of the ranger spells you know and replace it with another spell from the ranger spell list, which also must be of a level for which you have spell slots.\n\nSpellcasting Ability\nWisdom is your spellcasting ability for your ranger spells, since your magic draws on your attunement to nature. You use your Wisdom whenever a spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a ranger spell you cast and when making an attack roll with one.\n\nSpell save DC = 8 + your proficiency bonus + your Wisdom modifier\n\nSpell attack modifier = your proficiency bonus + your Wisdom modifier\n\nSpellcasting Focus (Optional)\nAt 2nd level, you can use a druidic focus as a spellcasting focus for your ranger spells. A druidic focus might be a sprig of mistletoe or holly, a wand or rod made of yew or another special wood, a staff drawn whole from a living tree, or an object incorporating feathers, fur, bones, and teeth from sacred animals.",
      "level_requirement": "2",
      "benefits": []
    },
    {
      "name": "Primeval Awareness",
      "description": "Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn’t reveal the creatures’ location or number.",
      "level_requirement": "3",
      "benefits": []
    },
    {
      "name": "Primal Awareness (Optional)",
      "description": "This 3rd-level feature replaces the Primeval Awareness feature. You gain no benefit from the replaced feature and don't qualify for anything in the game that requires it.\n\nYou can focus your awareness through the interconnections of nature: you learn additional spells when you reach certain levels in this class if you don't already know them, as shown in the Primal Awareness Spells table. These spells don't count against the number of ranger spells you know.\n\nYou can cast each of these spells once without expending a spell slot. Once you cast a spell in this way, you can't do so again until you finish a long rest.",
      "level_requirement": "3",
      "benefits": []
    },
    {
      "name": "Ranger Conclave",
      "description": "At 3rd level, you choose to emulate the ideals and training of a ranger conclave. Your choice grants you features at 3rd level and again at 7th, 11th, and 15th level.",
      "level_requirement": "3",
      "benefits": []
    },
    {
      "name": "Ability Score Improvement",
      "description": "When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
      "level_requirement": "4",
      "benefits": []
    },
    {
      "name": "Martial Versatility (Optional)",
      "description": "Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to rangers. This replacement represents a shift of focus in your martial practice.",
      "level_requirement": "4",
      "benefits": []
    },
    {
      "name": "Extra Attack",
      "description": "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
      "level_requirement": "5",
      "benefits": []
    },
    {
      "name": "Land's Stride",
      "description": "Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.\n\nIn addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the Entangle spell.",
      "level_requirement": "8",
      "benefits": []
    },
    {
      "name": "Hide in Plain Sight",
      "description": "Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.\n\nOnce you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.",
      "level_requirement": "10",
      "benefits": []
    },
    {
      "name": "Nature's Veil (Optional)",
      "description": "This 10th-level feature replaces the Hide in Plain Sight feature. You gain no benefit from the replaced feature and don't qualify for anything in the game that requires it.\n\nYou draw on the powers of nature to hide yourself from view briefly. As a bonus action, you can magically become invisible, along with any equipment you are wearing or carrying, until the start of your next turn.\n\nYou can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
      "level_requirement": "10",
      "benefits": []
    },
    {
      "name": "Vanish",
      "description": "Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail.",
      "level_requirement": "14",
      "benefits": []
    },
    {
      "name": "Feral Senses",
      "description": "At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it.\n\nYou are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened.",
      "level_requirement": "18",
      "benefits": []
    },
    {
      "name": "Foe Slayer",
      "description": "At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.",
      "level_requirement": "20",
      "benefits": []
    }
  ],
  "spellcasting": {
    "level": "2",
    "spell_slots" : {},
    "max_level_spellslots":9,
    "spells_known":[],
    "spellcasting_ability":""
  },
  "subclass": {
    "selected": False,
    "name": "Ranger Conclave",
    "description": "At 3rd level, you choose to emulate the ideals and training of a ranger conclave. Your choice grants you features at 3rd level and again at 7th, 11th, and 15th level.",
    "level": "3",
    "features": []
  },
  "num_skill_proficiencies": "3"
}