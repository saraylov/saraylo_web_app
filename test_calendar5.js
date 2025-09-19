// Test the fixed calendar logic for September 2025
const year = 2025;
const month = 8; // September (0-indexed)

// First day of the month
const firstDay = new Date(year, month, 1);
console.log('First day of September 2025:', firstDay.toDateString(), 'Day of week (getDay):', firstDay.getDay());

// Old calculation
const firstDayOfWeek = firstDay.getDay();
const oldPrevMonthDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
console.log('Old prevMonthDays calculation:', oldPrevMonthDays);

// New calculation
const newPrevMonthDays = (firstDayOfWeek + 6) % 7;
console.log('New prevMonthDays calculation:', newPrevMonthDays);

// Test with different days of the week
console.log('\nTesting different days of the week:');
const testDays = [
  { day: 0, name: 'Sunday' },
  { day: 1, name: 'Monday' },
  { day: 2, name: 'Tuesday' },
  { day: 3, name: 'Wednesday' },
  { day: 4, name: 'Thursday' },
  { day: 5, name: 'Friday' },
  { day: 6, name: 'Saturday' }
];

for (const test of testDays) {
  const oldCalc = test.day === 0 ? 6 : test.day - 1;
  const newCalc = (test.day + 6) % 7;
  console.log(`${test.name} (getDay: ${test.day}) -> Old: ${oldCalc}, New: ${newCalc}`);
}