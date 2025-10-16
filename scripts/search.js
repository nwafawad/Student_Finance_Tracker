// scripts/search.js
//this function filters records 
function filterAndHighlight(records, query, isCaseSensitive) {
    if (!query) {
        return { filteredRecords: records, searchRegex: null };
    }

    const flags = isCaseSensitive ? 'g' : 'gi';
    const searchRegex = compileRegex(query, flags);

    if (!searchRegex) {
        return { filteredRecords: records, searchRegex: null };
    }

    const filteredRecords = records.filter(record => {
        searchRegex.lastIndex = 0;
        const matchesDescription = searchRegex.test(record.description);
        searchRegex.lastIndex = 0;
        const matchesCategory = searchRegex.test(record.category);
        return matchesDescription || matchesCategory;
    });

    return { filteredRecords, searchRegex };
}