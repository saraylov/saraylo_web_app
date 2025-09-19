// Test full calendar generation logic for September 2025
const year = 2025;
const month = 8; // September (0-indexed)

function getCalendarDays() {
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Days from previous month to show
    const firstDayOfWeek = firstDay.getDay();
    // В России неделя начинается с понедельника (1), а не с воскресенья (0)
    // Для понедельника (1) нужно 0 дней предыдущего месяца
    // Для воскресенья (0) нужно 6 дней предыдущего месяца
    const prevMonthDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    // Days from next month to show
    const nextMonthDays = 42 - lastDay.getDate() - prevMonthDays;
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
}

const calendarDays = getCalendarDays();
console.log('Total days generated:', calendarDays.length);

console.log('First 10 days:');
for (let i = 0; i < Math.min(10, calendarDays.length); i++) {
    const day = calendarDays[i];
    console.log(`${i}: ${day.date.toDateString()} ${day.isCurrentMonth ? '(current)' : '(other)'}`);
}

console.log('Last 10 days:');
for (let i = Math.max(0, calendarDays.length - 10); i < calendarDays.length; i++) {
    const day = calendarDays[i];
    console.log(`${i}: ${day.date.toDateString()} ${day.isCurrentMonth ? '(current)' : '(other)'}`);
}

// Check specifically for September 31
console.log('\nChecking for September 31:');
let foundSept31 = false;
for (let i = 0; i < calendarDays.length; i++) {
    const day = calendarDays[i];
    if (day.date.getMonth() === 8 && day.date.getDate() === 31 && day.isCurrentMonth) {
        console.log('Found September 31 at index', i, ':', day.date.toDateString());
        foundSept31 = true;
    }
}
if (!foundSept31) {
    console.log('September 31 not found in current month days');
}