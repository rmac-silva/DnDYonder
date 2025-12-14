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
- Host on private server, get a domain name etc...

## Race Editing
- Enable editing and deleting races

## Bug Testing -- 
- Form validate everything, try and create empty items, classes, duplicate entries, SUBCLASSES.

## Usability
- Add a way to make the health calculation manual / use the class information
- Feedback on save
- Turn all console alerts into proper modal components that can be styled and re-used.
- Add loading spinners when fetching data from the backend.
- Enable the user to change subclasses. This entails removing the features granted by the subclass from the list. This is also a lazy fix for the next bullet point, since users can just re-select their subclass after editing.
- Make it possible to reload the class and subclass features. This is because if we update the class or subclass, the existing sheets won't have the new features until we re-create them. So add a button to force-reload the sheet features from the class/subclass.
- Spells follow the same issue as above, either make it so that spell information is loaded from the database (through a cache similar to the item cache), or simply force the user to re-add the spells

## Features to add - Post Release
- Possibility to export as JSON for backup purposes.
- Visual overhaul of the class and race feature hovering menu when creating a new character.
- Button to go to WIKI
- Sorting / Filtering class/race features.
- A tag system, so you can tag features with stuff like "+2 to dexterity, capped at 20" or "proficiency to stealth" so when creating character.

- Add sharing capabilities for characters.
- Eventually add macros to roll dice.

## Known Issues
- BUG! There's no feedback when you create an item with no name. Add form validation to item creation. This includes verifying that the item doesn't already exist (itemCache). Not sure if this is still valid.
- BUG! No feedback when WikiDot item fetching fails.
- BUG! Starting equipment selection is buggy. If you select equipment, then change class, then change back, the previously selected equipment is still selected and adds on top of the new class equipment.
- BUG! Can select multiple skill proficiencies when creating a character.
- BUG! When creating a race, if the subrace is empty, it crashes the app.

# Changelog

## Database Management Improvements
- Enabled editing subclasses.
- Enable editing and deleting spells.

## Bug Testing
- Can you add duplicate spells? ~~Yes you can~~ No you can't.

## Log
- Create a log that logs all actions sent to the backend, with timestamps and user info. This is important for debugging and tracking changes.

## Backups
- Implement a backup system that periodically saves the database, deleting old backups to save space. 