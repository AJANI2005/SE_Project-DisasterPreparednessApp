import { Checklist } from "./List";


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

