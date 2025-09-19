// Test calendar logic
const year = 2025;
const month = 8; // September (0-indexed)

// First day of the month
const firstDay = new Date(year, month, 1);
// Last day of the month
const lastDay = new Date(year, month + 1, 0);

console.log('First day of September 2025:', firstDay.toDateString(), 'Day of week:', firstDay.getDay());
console.log('Last day of September 2025:', lastDay.toDateString(), 'Day of month:', lastDay.getDate());

// Days from previous month to show
const firstDayOfWeek = firstDay.getDay();
const prevMonthDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
console.log('Previous month days to show:', prevMonthDays);

// Days from next month to show
const nextMonthDays = 42 - lastDay.getDate() - prevMonthDays;
console.log('Next month days to show:', nextMonthDays);
console.log('Total days in grid:', prevMonthDays + lastDay.getDate() + nextMonthDays);

// Previous month last day
const prevMonthLastDay = new Date(year, month, 0).getDate();
console.log('Previous month (August) has', prevMonthLastDay, 'days');