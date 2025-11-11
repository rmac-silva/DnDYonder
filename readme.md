# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> fastapi dev main.py --reload


# Running frontend
> cd frontend
> npm run dev (or npm install if needed)

# TODO:

## Database Management Improvements
- A way to edit or delete created classes, weapons etc... This has to be done only by admins! We can't let anyone delete anything. 
  Create a backend admin user and only allow that user to perform these actions. Only show the delete button if the user is an admin, checked at login.
- Alternatively, create a python terminal for editing and deleting the DB items.

## Bug Testing
- Form validate everything, try and create empty items, classes, duplicate entries, SUBCLASSES.

## Features to add
- Visual overhaul of the class and race feature hovering menu when creating a new character.

## Known Issues
- BUG! There's no feedback when you create an item with no name. Add form validation to item creation. This includes verifying that the item doesn't already exist (itemCache). Not sure if this is still valid.
- BUG! No feedback when WikiDot item fetching fails.

# Changelog
- Added alerts for form validation errors when creating a new race, item, class, etc...
- Prevented adding duplicate entries to items, races and classes.
- Fixed an issue where races with subraces names would not appear selected
- BUG! Even though I had weapon prof. shortsword, it didn't appear in misc profs. (Fixed by adding the misc proficiencies when creating the character.)
- Change how the max HP works. Some other factors can change how the maxHP is calculated, like feats, racial features, class features. Make it editable.
- Fetch spell information from WikiDot
- Check what happens when there's a subrace name.