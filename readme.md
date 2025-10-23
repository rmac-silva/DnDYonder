# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> fastapi dev main.py --reload


# Running frontend
> cd frontend
> npm run dev (or npm install if needed)

# TODO:
- Race Select. By selecting a race the player will gain additional proficiencies, languages, starting equipment etc... It should be the next page after class 
selection. With these two parameters set in stone, we should be able to have a consistent sheet that won't completely be remade whenever the player would pick another 
class for example.

- Some class features imply additional logic, spellcasting, 
  subclasses etc... These should have special keywords/tags that
  automatically trigger additional logic in the character sheet.
  For example, the "Spellcasting" feature should automatically
  add a spellcasting section to the character sheet. While the 
  subclass should prompt a new icon to select a subclass when
  the character reaches the appropriate level.



- A way to edit or delete created classes, weapons etc... This has to be done only by admins! We can't let anyone delete anything.

- BUG! Whenever you create a new class, it does not appear on the dropdown menu of the Create new character dialog.
  Force a refresh whenever a new class is created, so it fetches properly from the backend. (Possibly Fixed?)