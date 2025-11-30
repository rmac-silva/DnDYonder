import os
import sqlite3
import json

data = {
    "class_name": "Bard",
    "hit_die": "d10",
    "starting_hitpoints": 10,
    "hitpoints_per_level": 6,
    "armor_proficiencies": ["Light Armor"],
    "weapon_proficiencies": ["Simple Weapons", "Hand crossbow", "Longsword", "Rapier", "Shortsword"],
    "tool_proficiencies": [],
    "attribute_proficiencies": ["Dexterity", "Charisma"],
    "skill_proficiencies": [
        "Athletics",
        "Persuasion",
        "Acrobatics",
        "Sleight of Hand",
        "Stealth",
        "Arcana",
        "History",
        "Investigation",
        "Nature",
        "Religion",
        "Animal Handling",
        "Insight",
        "Medicine",
        "Perception",
        "Survival",
        "Deception",
        "Intimidation",
        "Performance",
    ],
    "starting_equipment": [{"name": "Leather armor"}, {"name": "Dagger"}],
    "starting_equipment_choices": [
        [[{"name": "Rapier", "uid": "1763224641645-8ra71s"}], [{"name": "Longsword", "uid": "1763224647624-rvbljd"}], [{"name": "Any Simple Weapon", "uid": "1763224657129-njlp8m"}]],
        [[{"name": "Diplomat\u2019s pack", "uid": "1763224723321-e0kncn"}], [{"name": "Entertainer's pack", "uid": "1763224743887-p0wzl4"}]],
        [[{"name": "Lute", "uid": "1763224766967-cegnwy"}], [{"name": "Any musical instrument", "uid": "1763224795082-cj3kx8"}]],
    ],
    "class_features": [
        {
            "name": "Bardic Inspiration",
            "description": "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.\nOnce within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.\nYou can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.\nYour Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.",
            "tables": [],
            "level_requirement": "1",
            "benefits": [],
        },
        {
            "name": "Jack of All Trades",
            "description": "Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.",
            "tables": [],
            "level_requirement": 2,
            "benefits": [],
        },
        {
            "name": "Song of Rest",
            "description": "Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points.\nThe extra Hit Points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.",
            "tables": [],
            "level_requirement": 2,
            "benefits": [],
        },
        {
            "name": "Magical Inspiration (Optional)",
            "description": "At 2nd level, if a creature has a Bardic Inspiration die from you and casts a spell that restores hit points or deals damage, the creature can roll that die and choose a target affected by the spell. Add the number rolled as a bonus to the hit points regained or the damage dealt. The Bardic Inspiration die is then lost.",
            "tables": [],
            "level_requirement": 2,
            "benefits": [],
        },
        {
            "name": "Bard College",
            "description": "At 3rd level, you delve into the advanced techniques of a bard college of your choice. Your choice grants you features at 3rd level and again at 6th and 14th level.",
            "tables": [
                {
                    "table_header": ["College ", " Source"],
                    "table_rows": [
                        ["Creation ", " Tasha's Cauldron of Everything"],
                        ["Eloquence ", " Mythic Odysseys of Theros ", "Tasha's Cauldron of Everything"],
                        ["Glamour ", " Xanathar's Guide to Everything"],
                        ["Lore ", " Player's Handbook"],
                        ["Spirits ", " Van Richten's Guide to Ravenloft"],
                        ["Swords ", " Xanathar's Guide to Everything"],
                        ["Valor ", " Player's Handbook"],
                        ["Whispers ", " Xanathar's Guide to Everything"],
                        "Archived Unearthed Arcana",
                        ["Mage of Lorehold ", " Unearthed Arcana 79 - Mages of Strixhaven"],
                        ["Mage of Silverquill ", " Unearthed Arcana 79 - Mages of Strixhaven"],
                        ["Creation ", " Unearthed Arcana 68 - Subclasses, Part 2"],
                        ["Spirits ", " Unearthed Arcana 74 - Subclasses, Part 4"],
                        ["Satire ", " Unearthed Arcana 12 - Kits of Old"],
                    ],
                    "num_columns": 2,
                }
            ],
            "level_requirement": 3,
            "benefits": [],
        },
        {
            "name": "Expertise",
            "description": "At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.\nAt 10th level, you can choose another two skill proficiencies to gain this benefit.",
            "tables": [],
            "level_requirement": 3,
            "benefits": [],
        },
        {
            "name": "Ability Score Improvement",
            "description": "When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
            "tables": [],
            "level_requirement": 4,
            "benefits": [],
        },
        {
            "name": "Bardic Versatility (Optional)",
            "description": "Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing a change in focus as you use your skills and magic:\nReplace one of the skills you chose for the Expertise feature with one of your other skill proficiencies that isn't benefiting from Expertise.\nReplace one cantrip you learned from this class's Spellcasting feature with another cantrip from the bard spell list .",
            "tables": [],
            "level_requirement": "4",
            "benefits": [],
        },
        {
            "name": "Font of Inspiration",
            "description": "Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.",
            "tables": [],
            "level_requirement": 5,
            "benefits": [],
        },
        {
            "name": "Countercharm",
            "description": "At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).",
            "tables": [],
            "level_requirement": 6,
            "benefits": [],
        },
        {
            "name": "Magical Secrets",
            "description": "By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.\nThe chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.\nYou learn two additional spells from any classes at 14th level and again at 18th level.",
            "tables": [],
            "level_requirement": 10,
            "benefits": [],
        },
        {
            "name": "Superior Inspiration",
            "description": "At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.",
            "tables": [],
            "level_requirement": 20,
            "benefits": [],
        },
    ],
    "spellcasting": {"level": "1", "spell_slots": {}, "spells_known": [], "spellcasting_ability": ""},
    "subclass": {
        "selected": False,
        "name": "Bard College",
        "description": "At 3rd level, you delve into the advanced techniques of a bard college of your choice. Your choice grants you features at 3rd level and again at 6th and 14th level.",
        "level": "3",
        "features": [],
    },
    "num_skill_proficiencies": "3",
}

# Update the bard class with the data
com = """UPDATE classes SET content = ? WHERE name = 'Bard';
"""

DB_PATH = os.getenv("DB_PATH", "NO_VALID_DATABASE_PATH")

sqlite3.connect("./src/db_utils/yonder-dev-db.db").execute(com, (json.dumps(data),)).connection.commit()