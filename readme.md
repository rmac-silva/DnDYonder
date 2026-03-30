# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> python main.py
    



# Running frontend
> cd frontend
> npm run dev

Don't forget to update the .env files in both the frontend and backend with the correct API URL and CORS origins.

# Renewal of CERTs
1. Stop nginx `sudo systemctl stop nginx`
2. Run `sudo certbot renew`
3. Restart nginx `sudo systemctl start nginx`
4. Redeploy


# RELEASE v 1.0 

## Usability
- Bards might have individual +1 bonuses to different stats. Enable manual stat editing for these cases.
- Make it possible to reload the entire sheet. This is because if we update the sheet, the existing sheets won't have the new features until we re-create them. So add a button to force-reload the sheet features from the class/subclass. This should create a copy of the existing sheet as a backup and try and recreate them.
- Spells follow the same issue as above, either make it so that spell information is loaded from the database (through a cache similar to the item cache) so they are always up to date.
- Enable the admins to edit item names, class_names, etc... use a separate field for "old_name" so that we can update the entry in the DB
- Visual overhaul of the class and race feature hovering menu when creating a new character.

## Community System
- Users that are not admin cannot create new public items or spells, but they can create private temporary ones.
- This means that when creating a new item, spell, class, if the user is not an admin, other users will not see this change.
- Users can suggest their own private creations for approval and they in turn can be made public, authorized by an admin or owner.

## Features to add - Post Release
- Possibility to export as JSON for backup purposes.
- Sorting / Filtering class/race features.
- A tag system, so you can tag features with stuff like "+2 to dexterity, capped at 20" or "proficiency to stealth" so when creating character.
- Eventually add macros to roll dice.

## Known Issues
Low Priority:
- BUG! Starting equipment selection is buggy. If you select equipment, then change class, then change back, the previously selected equipment is still selected and adds on top of the new class equipment.


# Changelog

## Usability
- Added an option for deleting your subclass, in case you want to switch to a different subclass or the subclass has suffered updates. Subclass features are directly deleted, as they are removed from the list.

## Bugfixes
- BUG! Popup for pending changes appears, and if I click 'cancel' it still navigates.