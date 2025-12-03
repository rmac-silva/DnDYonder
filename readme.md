# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> python main.py
    



# Running frontend
> cd frontend
> npm run dev -- --host 0.0.0.0

# TODO:
## Database Management Improvements
Enable editing subclasses

## Log
- Create a log that logs all actions sent to the backend, with timestamps and user info. This is important for debugging and tracking changes.

## Backups
- Implement a backup system that periodically saves the database, deleting old backups to save space. 

## Bug Testing
- Form validate everything, try and create empty items, classes, duplicate entries, SUBCLASSES.

# RELEASE v 1.0 
- Host on private server, get a domain name etc...

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


# Changelog
## Database Management Improvements
- A way to edit or delete created classes, weapons etc... This has to be done only by admins! We can't let anyone delete anything. 
  Create a backend admin user and only allow that user to perform these actions. Only show the delete button if the user is an admin, checked at login.
- Alternatively, create a python terminal for editing and deleting the DB items.

