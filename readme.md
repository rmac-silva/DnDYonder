# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> python main.py
    
# Running frontend
> cd frontend
> npm run dev -- --host 0.0.0.0


# RELEASE v 1.0 

## Usability
- Enable the user to change subclasses. This entails removing the features granted by the subclass from the list. This is also a lazy fix for the next bullet point, since users can just re-select their subclass after editing.
- Make it possible to reload the entire sheet. This is because if we update the sheet, the existing sheets won't have the new features until we re-create them. So add a button to force-reload the sheet features from the class/subclass. This should create a copy of the existing sheet as a backup.
- Spells follow the same issue as above, either make it so that spell information is loaded from the database (through a cache similar to the item cache) so they are always up to date.
- Enable the admins to edit item names, use a separate field for "old_name" so that we can update the entry in the DB
- Bards might have individual +1 bonuses to different stats. Enable manual stat editing for these cases.

## Features to add - Post Release
- Possibility to export as JSON for backup purposes.
- Visual overhaul of the class and race feature hovering menu when creating a new character.
- Sorting / Filtering class/race features.
- A tag system, so you can tag features with stuff like "+2 to dexterity, capped at 20" or "proficiency to stealth" so when creating character.
- Eventually add macros to roll dice.

## Known Issues
Low Priority:
- BUG! Starting equipment selection is buggy. If you select equipment, then change class, then change back, the previously selected equipment is still selected and adds on top of the new class equipment.


# Changelog

## Currency
- Currency will simply be handed through the inventory. The player can just add a "Gold" item. 

## Bugfixes
- BUGFIX! Made passive perception, passive insight and proficiency bonus readonly.
- BUGFIX! Ritual is now displayed in the details of the spell 
- BUGFIX! Spells now display concentration. Spells can now be created manually with concentration.
- BUGFIX! Spell components are now truncated if they are too long.
- BUGFIX! When editing components, there is now a notification for successfuly updating the spell.