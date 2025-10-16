// scripts/utils.js
// utility functions for common operations

// currency formatting
function formatCurrency(amount) {
    return `RWF ${Number(amount).toFixed(2)}`;
}

// date formatting
function formatDateToISO(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// unique ID generation
function generateRecordId() {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// filter records for the current month
function getCurrentMonthRecords(records) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth &&
            recordDate.getFullYear() === currentYear;
    });
}
