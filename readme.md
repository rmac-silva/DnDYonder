# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> python main.py
    



# Running frontend
> cd frontend
> npm run dev -- --host 0.0.0.0

# TODO:

# RELEASE v 1.0 



## Usability
- Enable the user to change subclasses. This entails removing the features granted by the subclass from the list. This is also a lazy fix for the next bullet point, since users can just re-select their subclass after editing.
- Make it possible to reload the class and subclass features. This is because if we update the class or subclass, the existing sheets won't have the new features until we re-create them. So add a button to force-reload the sheet features from the class/subclass.
- Spells follow the same issue as above, either make it so that spell information is loaded from the database (through a cache similar to the item cache) so they are always up to date.
- Enable the admins to edit item names, use a separate field for "old_name" so that we can update the entry in the DB


## Features to add - Post Release
- Possibility to export as JSON for backup purposes.
- Visual overhaul of the class and race feature hovering menu when creating a new character.
- Sorting / Filtering class/race features.
- A tag system, so you can tag features with stuff like "+2 to dexterity, capped at 20" or "proficiency to stealth" so when creating character.
- Eventually add macros to roll dice.

## Known Issues
Low Priority:
- BUG! Starting equipment selection is buggy. If you select equipment, then change class, then change back, the previously selected equipment is still selected and adds on top of the new class equipment.
- BUG! When editing a race, no pop-up to confirm success was shown.




# Changelog

## Race Editing
- Enable editing and deleting races

## Usability
- Make the point buy appear at the top of the stat blocks. Hide it if the user is above level 1.
- Add a way to make the health calculation manual / use the class information
- Feedback on save // Auto-save
- Add loading spinners when fetching data from the backend.
---
- Turned all console alerts into proper modal components that can be styled and re-used.
---
- If you add a spell that's level 3 while your spellcasting ability is like 1, it won't show up at all. 
- Should just grey out spells that are above your spellcasting level. 
- Should also add a modal popup telling you that the spell was added successfuly. 

## Bugfixes
Race Creation:
- BUG! When creating a duplicate race, it just throws an internal server error. Need to notify
about the duplicate instead.
- BUG! When creating a race, if the subrace is empty, it crashes the app.
- BUG! When creating a race, if you click off the page it creates instead of cancelling.
- BUG! There's no feedback when you create an item with no name. Add form validation to item creation. This includes verifying that the item doesn't already exist (itemCache). Not sure if this is still valid.

Wikidot Fetching:
- BUG! Sorcerer class automatic fetch failed. Something about proficiencies not being iterable.
- BUG! Artificer class fetching is broken because it tried to create a tool proficiency that already existed!
- BUG! Fixed a bug where fetching from Wikidot would not find certain spells because of capitalization issues.

Admin Page:
- BUG! When editing a spell, does it even save?

Sheet:
- BUG! Can't delete feature on mobile. Press and hold doesn't work on mobile devices.
- BUG! If you quit creating a character early, it warns you about unsaved changes, when it shouldn't since you didn't even do anything. (If you fill in everything about a sheet and then quit, it still creates it anyways. Because I have no idea if the user is navigating away after creating a sheet or before clicking create.)