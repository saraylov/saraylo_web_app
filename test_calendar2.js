// Test calendar logic for September 19, 2025
const year = 2025;
const month = 8; // September (0-indexed)

// First day of the month
const firstDay = new Date(year, month, 1);
// Target date
const targetDate = new Date(year, month, 19);

console.log('First day of September 2025:', firstDay.toDateString(), 'Day of week:', firstDay.getDay());
console.log('September 19, 2025:', targetDate.toDateString(), 'Day of week:', targetDate.getDay());

// Days from previous month to show
const firstDayOfWeek = firstDay.getDay();
const prevMonthDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
console.log('Previous month days to show:', prevMonthDays);

// Calculate position of September 19 in the grid
// Position = prevMonthDays + (target day - 1)
const position = prevMonthDays + (19 - 1);
console.log('Position of September 19 in grid (0-indexed):', position);

// Grid is 7 columns wide, so row = Math.floor(position / 7), column = position % 7
const row = Math.floor(position / 7);
const column = position % 7;
console.log('Row:', row, 'Column:', column);

// What day header should be at column', column);
const dayHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
console.log('Day header at column', column + ':', dayHeaders[column]);