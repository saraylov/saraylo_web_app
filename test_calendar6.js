// Test the correct placement of days in the grid
const year = 2025;
const month = 8; // September (0-indexed)

// First day of the month
const firstDay = new Date(year, month, 1);
console.log('First day of September 2025:', firstDay.toDateString(), 'Day of week (getDay):', firstDay.getDay());

// Headers: Пн(0) Вт(1) Ср(2) Чт(3) Пт(4) Сб(5) Вс(6)
// But getDay() returns: Вс(0) Пн(1) Вт(2) Ср(3) Чт(4) Пт(5) Сб(6)

// For September 1st (Monday, getDay()=1):
// It should be placed in column 0 (Пн)
// But if we just place it in order, it will be placed in grid position 0
// which corresponds to the first getDay() value (Вс)

// The fix is to add empty days at the beginning to shift the first day to the correct column
const firstDayOfWeek = firstDay.getDay(); // 1 for Monday
// We need to convert getDay() result to our grid column
// getDay(): Вс(0) Пн(1) Вт(2) Ср(3) Чт(4) Пт(5) Сб(6)
// Grid:    Пн(0) Вт(1) Ср(2) Чт(3) Пт(4) Сб(5) Вс(6)
// So we need to shift by 1 position to the left (or 6 to the right)
const gridColumnForFirstDay = (firstDayOfWeek + 6) % 7;
console.log('Grid column for September 1st:', gridColumnForFirstDay);

// Number of empty days needed at the start
const prevMonthDays = gridColumnForFirstDay;
console.log('Empty days needed at start:', prevMonthDays);

// Test with all days of the week
console.log('\nTesting placement for all days:');
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const gridHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

for (let i = 0; i < 7; i++) {
  const gridColumn = (i + 6) % 7;
  console.log(`${daysOfWeek[i]} (getDay:${i}) -> Grid column: ${gridColumn} (${gridHeaders[gridColumn]})`);
}