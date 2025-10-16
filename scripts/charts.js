// scripts/charts.js
// this functions to calculate stats for dashboard
function calculateDashboardStats(records, budgetCap) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= sevenDaysAgo;
    }); // records from the last 7 days

    const monthlyRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }); // records from the current month

    const weekSpending = weekRecords.reduce((sum, record) => sum + record.amount, 0);
    const monthlySpending = monthlyRecords.reduce((sum, record) => sum + record.amount, 0);
    const balance = budgetCap - monthlySpending;

    return {
        budget: budgetCap,
        weekSpending: weekSpending,
        monthlySpending: monthlySpending,
        balance: balance
    };
}
