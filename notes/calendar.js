function getDayLetter(dayOfWeek) {
    const dayLetters = ["S ", "M ", "T ", "W ", "T ", "F ", "S "];
    return dayLetters[dayOfWeek];
}

function isSpecialDay(year, month, day) {
    const specialDays = [
        { month: 1, day: 1 },  // Example: New Year's Day
        { month: 7, day: 4 },  // Example: Independence Day
        // Add more special days here
    ];

    return specialDays.some(special => special.month === month + 1 && special.day === day);
}

function createFullYearCalendar(year) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let calendar = "<tr>";

    // Month headers
    for (let month = 0; month < 12; month++) {
        calendar += `<th class="month-header">${monthNames[month]}</th>`;
    }
    calendar += "</tr>";

    const maxDays = 31;

    // Days
    for (let day = 1; day <= maxDays; day++) {
        calendar += "<tr>";
        for (let month = 0; month < 12; month++) {
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            if (day <= daysInMonth) {
                let date = new Date(year, month, day);
                let dayOfWeek = date.getDay();
                let className = `day-${dayOfWeek}`;
                if (isSpecialDay(year, month, day)) {
                    className = "special-day";
                } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                    className = "weekend";
                }
                let dayLetter = getDayLetter(dayOfWeek);
                calendar += `<td class="${className}">${dayLetter}${day}</td>`;
            } else {
                calendar += "<td></td>";
            }
        }
        calendar += "</tr>";
    }

    return calendar;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calendar").innerHTML = createFullYearCalendar(2024);
});
