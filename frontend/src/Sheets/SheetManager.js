var saved = true;
var saving = false;


var draftGlobal = null;
var sheetidGlobal = null;
var hashedemailGlobal = null;


export function initSheetManager(draft,sheetid,hashedemail) {
    draftGlobal = draft;
    sheetidGlobal = sheetid;
    hashedemailGlobal = hashedemail;
    console.log("SheetManager initialized:", {draftGlobal, sheetidGlobal, hashedemailGlobal});
}

export function getDraftGlobal() {
    return draftGlobal;
}

export function isSheetSaved() {
    ///Tells us whether the sheet has unsaved changes
    return saved;
}

export function isSheetSaving() {
    return saving;
}

function setSheetSaved(value) {
    saved = value;
}

export function setDraftGlobal(draft) {
    setSheetSaved(false);
    draftGlobal = draft;
}

export function saveSheet() {
    //Check if the sheet is a valid sheet
    if(draftGlobal === null || draftGlobal.name === '') {
        console.warn("Attempted to save sheet before it was initialized");
        return;
    }

    /// Saves the sheet in its current state to the backend
    if (saving) return; //Prevent multiple simultaneous saves
    saving = true;
    saveSheetToBackend().then(() => {
        saving = false;
        setSheetSaved(true);
    }).catch(() => {
        saving = false;
    });
}

const saveSheetToBackend = async () => {


    if (sheetidGlobal === undefined) {
        console.log("Saving new sheet...");
        return saveNewSheet(); //Call the load function
    } else {
        return saveExistingSheet();
    }
};

export const saveNewSheet = async () => {
        try {
            // If you have a class with jsonify(), call draft = draft.jsonify() instead
            const payload = {
                'sheet': draftGlobal,
                'username': hashedemailGlobal,
                'token': localStorage.getItem('authToken')
            } // plain JS object
            const res = await fetch(`${import.meta.env.VITE_API_URL}/sheets/new`, {
                method: 'POST', // or PUT depending on your API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            const saved = await res.json();


            //Navigate to the new sheet's page, since it has an ID now
            //Saves on /sheets/sheet_id will override the pre-existing sheet
            setSheetSaved(true);
            sheetidGlobal = saved.id; //Update the global sheet ID
            return(`/sheets/${hashedemailGlobal}/${saved.id}`);


        } catch (err) {
            console.error('Save error', err);
            
            throw err;
        }
    };

    const saveExistingSheet = async () => {
        draftGlobal.id = parseInt(sheetidGlobal); //Ensure the draft has the correct ID
        const payload = {
            'sheet': draftGlobal,
        }
        
        
        try {

            const res = await fetch(`${import.meta.env.VITE_API_URL}/sheets/${hashedemailGlobal}/${sheetidGlobal}`, {
                method: 'POST', // or PUT depending on your API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            // const saved = await res.json(); - Do something with the success message

        } catch (error) {
            console.error('Save error', error);
            throw error;
        }


    }