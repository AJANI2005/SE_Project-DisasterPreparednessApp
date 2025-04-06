import { get, set } from "idb-keyval";
import { Checklist, Icon } from "./List";


// Natural Disaster APIS

/*
    Volcano - "https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes"
    Earthquake - "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-03-25" 
    Hurricane - "https://api.weather.gov/alerts/active?event=Earthquake" 
*/


export const initStorage = () => {
    // Initialize local storage 
    const storage = localStorage;
    if (!storage.getItem("checklists")) {
        storage.setItem("checklists", JSON.stringify([]));
    }
}


export const saveChecklist = (checklist: Checklist) => {
    // Save the checklist data to a remote API or local storage
    const storage = localStorage;
    const checklists = storage.getItem("checklists");
    let checklistData = [];
    if (checklists) {
        checklistData = JSON.parse(checklists);
    }
    // Check if list already exists
    const existingList = checklistData.find((list: Checklist) => list.id === checklist.id);
    if (existingList) {
        // Update the existing list
        const index = checklistData.indexOf(existingList);
        checklistData[index] = checklist;
    } else {
        // Add a new list
        checklistData.push(checklist);
    }
    storage.setItem("checklists", JSON.stringify(checklistData));
}


export const removeChecklist = (id: string) => {
    // Remove the checklist from local storage
    const storage = localStorage;
    const checklists = storage.getItem("checklists");
    let checklistData = [];
    if (checklists) {
        checklistData = JSON.parse(checklists);
    }
    const index = checklistData.findIndex((list: Checklist) => list.id === id);
    if (index > -1) {
        checklistData.splice(index, 1);
    }
    storage.setItem("checklists", JSON.stringify(checklistData));
}


export const getChecklist = (id: string) => {
    // Fetch the checklist data from a remote API or local storage
    const storage = localStorage;
    const checklists = storage.getItem("checklists");
    if (checklists) {
        const checklistData = JSON.parse(checklists);
        return checklistData.find((checklist: Checklist) => checklist.id === id);
    } else {
        return undefined;
    }

}

export const getAllChecklists = () => {
    // Fetch all checklist data from a remote API or local storage
    const storage = localStorage;
    const checklists = storage.getItem("checklists");
    if (checklists) {
        return JSON.parse(checklists);
    } else {
        return [];
    }
}


export const saveIcon = (icon: Icon, callback: (error: Error | null) => void) => {
    set(`icon-${icon.id}`, icon)
        .then(() => {
            callback(null);  // If successful, pass null to indicate no error
        })
        .catch((error) => {
            callback(error);  // Pass the error if something goes wrong
        });
};

export const getIcon = (id: string, callback: (error: Error | null, icon: Icon | null) => void) => {
    get(`icon-${id}`)
        .then((icon) => {
            if (icon) {
                callback(null, icon);  // Return the icon if found
            } else {
                callback(null, null);  // No icon found, return null
            }
        })
        .catch((error) => {
            callback(error, null);  // Return error if something goes wrong
        });
};
