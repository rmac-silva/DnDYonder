# Requirements
> Found under requirements.txt

# Executing backend
> cd src
> fastapi dev main.py --reload


# Running frontend
> cd frontend
> npm run dev (or npm install if needed)

# TODO:
- A way to edit or delete created classes, weapons etc... This has to be done only by admins! We can't let anyone delete anything. 
  Create a backend admin user and only allow that user to perform these actions. Only show the delete button if the user is an admin, checked at login.

- Alternatively, create a python terminal for editing and deleting the DB items.

- BUG! Even though I had weapon prof. shortsword, it didn't appear in misc profs.
- BUG! There's no feedback when you create an item with no name. Add form validation to item creation.

# Fixed Issues:
- BUG! When adding a new class, it doesn't expand the menu automatically to show the new class and select new options. (Sort of fixed, it now selects empty, forcing the user to re-select it.)
- BUG! When changing the name on top, it won't change the name on the bottom. (Fixed, a bit slow still)