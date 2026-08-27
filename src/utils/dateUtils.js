export function parseDDMMYYYY(dateString) {
  if (!dateString || dateString === '-') return null;
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1; // month is 0-indexed in JS
    const y = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  return null;
}

export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function calculateWorkDays(startDateStr, endDateStr, holidayList = []) {
  const start = parseDDMMYYYY(startDateStr);
  if (!start) return null; // Cannot calculate if start date is invalid

  let end = parseDDMMYYYY(endDateStr);
  if (!end) {
    end = new Date(); // If GR Date is empty, use today
    end.setHours(0, 0, 0, 0);
  }
  
  // If start is after end, returning 0 might be safer, or negative. Let's return 0.
  if (start > end) return 0;

  // Parse holidays to Date objects
  const holidays = holidayList.map(h => {
     const d = parseDDMMYYYY(h);
     if (d) d.setHours(0, 0, 0, 0);
     return d;
  }).filter(Boolean);

  let workDays = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 1-6 are Mon-Sat
    
    // Only count Mon-Sat
    if (dayOfWeek !== 0) {
      // Check if it's a holiday
      const isHoliday = holidays.some(h => isSameDay(h, currentDate));
      if (!isHoliday) {
        workDays++;
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // The formula requires subtracting 1 from the final result.
  // We ensure it doesn't go below 0 (e.g., if workDays was 0 somehow).
  return Math.max(0, workDays - 1);
}
