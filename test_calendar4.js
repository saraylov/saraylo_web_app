// Test exact calendar generation for September 2025
const year = 2025;
const month = 8; // September (0-indexed)

// First day of the month
const firstDay = new Date(year, month, 1);
console.log('First day:', firstDay.toDateString(), 'getDay():', firstDay.getDay());

// Last day of the month
const lastDay = new Date(year, month + 1, 0);
console.log('Last day:', lastDay.toDateString(), 'getDate():', lastDay.getDate());

// Days from previous month to show
const firstDayOfWeek = firstDay.getDay();
const prevMonthDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
console.log('Previous month days to show:', prevMonthDays);

// Days from next month to show
const nextMonthDays = 42 - lastDay.getDate() - prevMonthDays;
console.log('Next month days to show:', nextMonthDays);

console.log('\nGenerating current month days:');
for (let i = 1; i <= lastDay.getDate(); i++) {
  const date = new Date(year, month, i);
  console.log(`Day ${i}: ${date.toDateString()}, getDate(): ${date.getDate()}`);
  if (i === 31) {
    console.log('  WARNING: This should not happen since September only has 30 days!');
  }
}