# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> fastapi dev main.py --reload


# Running frontend
> cd frontend
> npm run dev (or npm install if needed)

# TODO:

- Some class features imply additional logic, spellcasting, 
  subclasses etc... These should have special keywords/tags that
  automatically trigger additional logic in the character sheet.
  For example, the "Spellcasting" feature should automatically
  add a spellcasting section to the character sheet. While the 
  subclass should prompt a new icon to select a subclass when
  the character reaches the appropriate level.

- Whenever you change something, like the inventory or even the amount of health, it should register that a change occurred. Whenever you 
  try and leave the page without saving, it should prompt "You have unsaved changes, are you sure you want to leave?" or something like that.

- A way to edit or delete created classes, weapons etc... This has to be done only by admins! We can't let anyone delete anything. 
  Create a backend admin user and only allow that user to perform these actions. Only show the delete button if the user is an admin, checked at login.


- BUG! Choice Groups do not have the newly added weapons. I added a shortsword and it didn't exist. But if I add on fixed starting equipment it refreshes properly. So the choice groups need to fetch the weapon list again after adding a new weapon.
- BUG! Even though I had weapon prof. shortsword, it didn't appear in misc profs.
- BUG! Death saves aren't tracked, store them under draf.stats.death_saves_success and draft.stats.death_saves_failure
- BUG! You can't go back from creating a character. It still attempts to create an empty sheet. Instead navigate back to sheets if Sheet.jsx does not have enough data to create a character.