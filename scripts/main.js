// scripts/main.js
// Main application logic - UI rendering and event handling
// variables for DOM elements
const tableBody = document.querySelector('#recordsTableBody');
const searchInput = document.querySelector('#searchInput');
const budgetInput = document.querySelector('#budgetCapInput');
const ariaAnnouncer = document.querySelector('#ariaAnnouncer');
const exportBtn = document.querySelector('#exportDataBtn');
const importInput = document.querySelector('#importDataInput');
const importStatus = document.querySelector('#importStatus');
const form = document.querySelector('#addEditForm');
const formDescription = document.querySelector('#formDescription');
const formAmount = document.querySelector('#formAmount');
const formDate = document.querySelector('#formDate');
const formCategory = document.querySelector('#formCategory');

//this function renders the table with the records and search regex
function renderTable(records, searchRegex) {
    tableBody.innerHTML = '';

    if (!records || records.length === 0) {
        const noRecordsRow = `
            <tr>
                <td colspan="5" class="text-center">No records found.</td>
            </tr>
        `;
        tableBody.innerHTML = noRecordsRow;
        return;
    }

    // render each record as a table row
    records.forEach(record => {
        const row = document.createElement('tr');
        row.dataset.id = record.id;

        const formattedAmount = formatCurrency(record.amount);

        let description = record.description;
        let category = record.category;

        if (searchRegex) {
            description = record.description.replace(searchRegex, match => `<mark>${match}</mark>`);
            category = record.category.replace(searchRegex, match => `<mark>${match}</mark>`);
        }

        row.innerHTML = `
            <td>${record.date}</td>
            <td>${description}</td>
            <td>${category}</td>
            <td class="text-right">${formattedAmount}</td>
            <td>
                <button class="edit-btn" data-id="${record.id}">Edit</button>
                <button class="delete-btn" data-id="${record.id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

//this function sorts records
function sortRecords() {
    const [key, direction] = state.sortBy.split('_');

    state.records.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        let comparison = 0;

        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else {
            comparison = String(valA).localeCompare(String(valB));
        }

        return direction === 'desc' ? comparison * -1 : comparison;
    });
}

//this function sets up listeners for sorting when table headers are clicked
function setupSortListeners() {
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.dataset.sort;
            const [currentKey, currentDirection] = state.sortBy.split('_');

            let newDirection = 'asc';
            if (sortKey === currentKey && currentDirection === 'asc') {
                newDirection = 'desc';
            }

            state.sortBy = `${sortKey}_${newDirection}`;

            sortRecords();
            renderTable(state.records);
            saveState(state);
        });
    });
}

//this function handles search input and updates the table
function handleSearch() {
    const query = searchInput.value;
    const isCaseSensitive = false;

    const { filteredRecords, searchRegex } = filterAndHighlight(state.records, query, isCaseSensitive);

    renderTable(filteredRecords, searchRegex);
}
//this function sets up navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');

    function showSection(hash) {
        const sectionId = hash ? hash.substring(1) : 'dashboard';

        sections.forEach(section => {
            if (section.id === sectionId) {
                section.removeAttribute('hidden');
            } else {
                section.setAttribute('hidden', true);
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            showSection(event.currentTarget.hash);
        });
    });

    window.addEventListener('hashchange', () => {
        showSection(window.location.hash);
    });

    showSection(window.location.hash);
}
//this function calculates dashboard stats
function renderDashboard() {
    const stats = calculateDashboardStats(state.records, state.budgetCap);

    document.querySelector('#statBudget').textContent = formatCurrency(stats.budget);
    document.querySelector('#statWeekSpending').textContent = formatCurrency(stats.weekSpending);

    const balanceEl = document.querySelector('#statBalance');
    balanceEl.textContent = formatCurrency(stats.balance);

    balanceEl.classList.remove('balance-positive', 'balance-warning', 'balance-negative');

    if (stats.balance < 0) {
        balanceEl.classList.add('balance-negative');
    } else if (stats.budget > 0 && stats.balance < stats.budget * 0.2) {
        balanceEl.classList.add('balance-warning');
    } else {
        balanceEl.classList.add('balance-positive');
    }
}

//this function updates budget status
function updateBudgetStatus() {
    const cap = state.budgetCap;
    const budgetStatusDisplay = document.querySelector('#budgetStatusDisplay');
    const budgetStatusText = document.querySelector('#budgetStatusText');

    if (cap <= 0) {
        ariaAnnouncer.textContent = 'Monthly budget not set.';
        if (budgetStatusDisplay) budgetStatusDisplay.style.display = 'none';
        return;
    }

    const monthlyRecords = getCurrentMonthRecords(state.records);
    const monthlySpending = monthlyRecords.reduce((sum, r) => sum + r.amount, 0);

    const remaining = cap - monthlySpending;
    const percentageUsed = (monthlySpending / cap) * 100;
    let message = '';
    let statusClass = '';

    if (remaining < 0) {
        message = `Budget exceeded by ${formatCurrency(Math.abs(remaining))}!`;
        statusClass = 'danger';
        ariaAnnouncer.setAttribute('aria-live', 'assertive');
    } else if (percentageUsed >= 90) {
        message = `Only ${formatCurrency(remaining)} remaining (${(100 - percentageUsed).toFixed(1)}% left)`;
        statusClass = 'warning';
        ariaAnnouncer.setAttribute('aria-live', 'polite');
    } else if (percentageUsed >= 75) {
        message = `${formatCurrency(remaining)} remaining in your budget this month`;
        statusClass = 'warning';
        ariaAnnouncer.setAttribute('aria-live', 'polite');
    } else {
        message = `${formatCurrency(remaining)} remaining in your budget this month`;
        statusClass = 'success';
        ariaAnnouncer.setAttribute('aria-live', 'polite');
    }

    ariaAnnouncer.textContent = message;

    if (budgetStatusDisplay && budgetStatusText) {
        budgetStatusDisplay.style.display = 'block';
        budgetStatusDisplay.className = 'budget-status-display ' + statusClass;
        budgetStatusText.textContent = `Current month spending: ${formatCurrency(monthlySpending)} / ${formatCurrency(cap)} - ${message}`;
    }
}

//this function sets up listeners for settings budget cap and import/export
function setupSettingsListeners() {
    budgetInput.addEventListener('change', () => {
        const newCap = Number(budgetInput.value) || 0;
        state.budgetCap = newCap;
        saveState(state);
        renderDashboard();
        updateBudgetStatus();
    });
    exportBtn.addEventListener('click', () => {
        try {
            const jsonState = JSON.stringify(state, null, 2);
            const blob = new Blob([jsonState], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'finance-data.json';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('Error exporting data.');
        }
    });

    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!validateImportedData(importedData)) {
                    throw new Error('Invalid or corrupted data file.');
                }

                state.records = importedData.records || [];
                state.sortBy = importedData.sortBy || 'date_desc';
                state.budgetCap = importedData.budgetCap || 0;

                saveState(state);

                budgetInput.value = state.budgetCap > 0 ? state.budgetCap : '';
                fullUIRefresh();

                importStatus.textContent = 'Import successful!';
                importStatus.style.color = 'green';

            } catch (error) {
                console.error('Failed to import data:', error);
                importStatus.textContent = `Error: ${error.message}`;
                importStatus.style.color = 'red';
            } finally {
                importInput.value = '';
            }
        };

        reader.onerror = () => {
            importStatus.textContent = 'Error reading the file.';
            importStatus.style.color = 'red';
        };

        reader.readAsText(file);
    });
}
//this function refreshes the entire UI
function fullUIRefresh() {
    sortRecords();
    renderTable(state.records);
    renderDashboard();
    updateBudgetStatus();
    searchInput.value = '';
}

//this function shows validation error messages
function showValidationError(field, message) {
    const errorId = `error${field.charAt(0).toUpperCase()}${field.slice(1)}`;
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

//this function handles form submission
function handleFormSubmit(event) {
    event.preventDefault();

    let isValid = true;
    if (!formDescription.value.trim()) {
        showValidationError('description', 'Description cannot be empty.');
        isValid = false;
    } else {
        showValidationError('description', '');
    }
    if (!validationRules.amount.test(formAmount.value)) {
        showValidationError('amount', 'Please enter a valid amount (e.g., 12.50).');
        isValid = false;
    } else {
        showValidationError('amount', '');
    }
    if (!isValidDate(formDate.value)) {
        showValidationError('date', 'Please enter a valid date.');
        isValid = false;
    } else {
        showValidationError('date', '');
    }
    if (!formCategory.value) {
        showValidationError('category', 'Please select a category.');
        isValid = false;
    } else {
        showValidationError('category', '');
    }

    if (!isValid) return;

    const now = new Date().toISOString();
    if (state.editingRecordId) {
        const record = state.records.find(r => r.id === state.editingRecordId);
        record.description = formDescription.value.trim();
        record.amount = Number(formAmount.value);
        record.category = formCategory.value;
        record.date = formDate.value;
        record.updatedAt = now;
    } else {
        const newRecord = {
            id: generateRecordId(),
            description: formDescription.value.trim(),
            amount: Number(formAmount.value),
            category: formCategory.value,
            date: formDate.value,
            createdAt: now,
            updatedAt: now,
        };
        state.records.push(newRecord);
    }

    saveState(state);
    fullUIRefresh();

    resetForm();
    window.location.hash = '#records';
}
//this function sets up listeners for the add/edit form
function setupFormListeners() {
    form.addEventListener('submit', handleFormSubmit);
    const cancelButton = form.querySelector('button[type="button"]');
    cancelButton.addEventListener('click', () => {
        resetForm();
        window.location.hash = '#records';
    });
}
//this function populates the form for editing a record
function populateFormForEdit(recordId) {
    const record = state.records.find(r => r.id === recordId);
    if (!record) return;

    state.editingRecordId = recordId;

    formDescription.value = record.description;
    formAmount.value = record.amount;
    formDate.value = record.date;
    formCategory.value = record.category;

    document.querySelector('#form h2').textContent = 'Edit Record';
    form.querySelector('button[type="submit"]').textContent = 'Update Record';

    window.location.hash = '#form';
}
//this function handles clicks on the records table
function handleTableClick(event) {
    const target = event.target;
    const recordId = target.dataset.id;

    if (!recordId) return;

    if (target.matches('.delete-btn')) {
        if (confirm('Are you sure you want to delete this record?')) {
            state.records = state.records.filter(record => record.id !== recordId);
            saveState(state);
            fullUIRefresh();
        }
    }
    if (target.matches('.edit-btn')) {
        populateFormForEdit(recordId);
    }
}

//this function resets the add/edit form
function resetForm() {
    form.reset();
    state.editingRecordId = null;
    document.querySelector('#form h2').textContent = 'Add/Edit Record';
    form.querySelector('button[type="submit"]').textContent = 'Save Record';

    formDate.value = formatDateToISO();

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

//this function initializes the application
async function initializeApp() {
    const initialState = await loadState();

    state.records = initialState.records || [];
    state.sortBy = initialState.sortBy || 'date_desc';
    state.budgetCap = initialState.budgetCap || 0;
    budgetInput.value = state.budgetCap > 0 ? state.budgetCap : '';

    sortRecords();
    renderTable(state.records);
    setupSortListeners();
    searchInput.addEventListener('input', handleSearch);
    setupNavigation();
    renderDashboard();
    setupSettingsListeners();
    updateBudgetStatus();
    setupFormListeners();
    tableBody.addEventListener('click', handleTableClick);

    formDate.value = formatDateToISO();

    console.log('Application initialized with state:', state);
}

document.addEventListener('DOMContentLoaded', initializeApp);