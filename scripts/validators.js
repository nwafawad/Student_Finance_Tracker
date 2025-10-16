// Validation regex patterns

const validationRules = {
    description: /^\s*(\S+(\s+\S+)*)\s*$/,
    amount: /^\d+(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z\s\-]+$/,
    duplicateWord: /\b(\w+)\s+\1\b/,
};

//this function compiles a regex pattern
function compileRegex(input, flags = 'i') {
    try {
        return new RegExp(input, flags);
    } catch (e) {
        console.error("Invalid regular expression:", e);
        return null;
    }
}

//this function checks if a record is valid
function isValidDate(dateString) {
    if (!validationRules.date.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) &&
        dateString === date.toISOString().split('T')[0];
}

//this function validates imported data
function validateImportedData(data) {
    if (typeof data !== 'object' || data === null) return false;

    if (!Array.isArray(data.records)) return false;

    if (data.records.length > 0) {
        const firstRecord = data.records[0];
        const requiredKeys = ['id', 'description', 'amount', 'category', 'date'];
        return requiredKeys.every(key => key in firstRecord);
    }

    return true;
}