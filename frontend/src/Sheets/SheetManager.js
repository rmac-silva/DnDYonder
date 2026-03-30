var saved = true;
var saving = false;


var draftGlobal = null;
var sheetidGlobal = null;
var hashedemailGlobal = null;
var autoSaveInterval = null;


export function initSheetManager(draft, sheetid, hashedemail) {
    draftGlobal = draft;
    sheetidGlobal = sheetid;
    hashedemailGlobal = hashedemail;
    console.log("SheetManager initialized:", { draftGlobal, sheetidGlobal, hashedemailGlobal });

    // Initialize auto-save every 5 minutes
    if (!autoSaveInterval) {
        autoSaveInterval = setInterval(() => {
            // Only auto-save if there are unsaved changes and a sheet is actually loaded
            if (draftGlobal && draftGlobal.name !== '' && !isSheetSaved()) {
                console.log("Triggering auto-save...");
                saveSheet(true); // Call silent save
            }
        }, 5 * 60 * 1000); // 5 minutes);
    }
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

export function saveSheet(silent = false) {
    //Check if the sheet is a valid sheet
    if (draftGlobal === null || draftGlobal.name === '') {
        if (!silent) console.warn("Attempted to save sheet before it was initialized");
        return Promise.resolve(false);
    }

    /// Saves the sheet in its current state to the backend
    if (saving) return Promise.resolve(null); //Prevent multiple simultaneous saves
    saving = true;

    return saveSheetToBackend().then(() => {
        saving = false;
        setSheetSaved(true);
        console.log("Auto-save completed.");
        return { res: true, msg: "Save successful" };
    }).catch((err) => {
        console.error("Auto-save failed:", err);
        saving = false;
        return { res: false, msg: "Save failed: " + err.message };
    });
}

export function deleteSubclass() {
    if (draftGlobal === null || draftGlobal.name === '' || sheetidGlobal === null || hashedemailGlobal === null) {
        console.warn("Attempted to delete subclass before it was initialized");
        return Promise.resolve(false);
    }

    return deleteSubclassFromBackend().then( () => {
        // Dispatch the event to notify Sheet.jsx to refresh
        window.dispatchEvent(new CustomEvent('sheet-update-required', { 
            detail: { reason: "Subclass deleted" } 
        }));
        return { res: true, msg: "Subclass deleted successfully" };
    }).catch((err) => {
        console.error("Delete subclass failed:", err);
        return { res: false, msg: "Delete failed: " + err.message };
    });

}

export const deleteSubclassFromBackend = async () => {
    try {
        const payload = {
        'sheet': draftGlobal,
        'username': hashedemailGlobal,
        'token': localStorage.getItem('authToken')
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/sheets/${hashedemailGlobal}/${sheetidGlobal}/subclass`, {
            method: 'DELETE', // or PUT depending on your API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

    const success = await res.json();
    if (!res.ok) throw new Error(`Failed to delete subclass: ${success.detail}`);
    
    return true;
    } catch (error) {
        console.error('Error deleting subclass. ', error);
        return false;
    }
}

const saveSheetToBackend = async () => {


    if (sheetidGlobal === undefined) {
        console.log("Saving new sheet...");
        console.log(draftGlobal);
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
        const saved = await res.json();
        if (!res.ok) throw new Error(`Save failed: ${saved.detail}`);


        //Navigate to the new sheet's page, since it has an ID now
        //Saves on /sheets/sheet_id will override the pre-existing sheet
        setSheetSaved(true);
        sheetidGlobal = saved.id; //Update the global sheet ID
        return (`/sheets/${hashedemailGlobal}/${saved.id}`);


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