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


- BUG! Choice Groups do not have the newly added weapons. I added a shortsword and it didn't exist. But if I add on fixed starting equipment it refreshes properly. So the choice groups need to fetch the weapon list again after adding a new weapon.
- BUG! Even though I had weapon prof. shortsword, it didn't appear in misc profs.
