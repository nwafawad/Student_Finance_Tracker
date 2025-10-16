// scripts/storage.js

const STORAGE_KEY = 'finance-tracker-state';
//functions to save and load state from localStorage
function saveState(currentState) {
    try {
        const jsonState = JSON.stringify(currentState);
        localStorage.setItem(STORAGE_KEY, jsonState);
    } catch (error) {
        console.error("Could not save state to localStorage", error);
    }
}
//this function loads state from localStorage or from seed.json if not found
async function loadState() {
    try {
        const jsonState = localStorage.getItem(STORAGE_KEY);

        if (jsonState) {
            return JSON.parse(jsonState);
        }

        console.log("No saved state found. Loading seed data...");
        const response = await fetch('./seed.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const seedData = await response.json();

        return { records: seedData };

    } catch (error) {
        console.error("Could not load state from localStorage or seed.json", error);
        return { records: [] };
    }
}