// Calendar generator functions

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function firstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Monthly markdown table
function generateMonthStyle(year) {
  let md = `## ${year}\n\n`;
  for (let month = 0; month < 12; month++) {
    md += `### ${monthNames[month]}\n`;
    md += `|  S |  M |  T |  W |  T |  F |  S |\n`;
    md += `|---:|---:|---:|---:|---:|---:|---:|\n`;

    let firstDay = firstDayOfWeek(year, month);
    let days = daysInMonth(year, month);

    let day = 1;
    let week = Array(7).fill("");
    for (let i = firstDay; i < 7 && day <= days; i++) {
      week[i] = day++;
    }
    md += "| " + week.join(" | ") + " |\n";

    while (day <= days) {
      week = Array(7).fill("");
      for (let i = 0; i < 7 && day <= days; i++) {
        week[i] = day++;
      }
      md += "| " + week.join(" | ") + " |\n";
    }
    md += "\n";
  }
  return md;
}

// Quarterly block markdown
function generateQuarterStyle(year) {
  let md = `## ${year}\n\n`;
  const quarters = [
    [0, 2, "Q1"],
    [3, 5, "Q2"],
    [6, 8, "Q3"],
    [9, 11, "Q4"],
  ];
  for (const [start, end, qname] of quarters) {
    md += `|   ${qname.padEnd(6)} |  S |  M |  T |  W |  T |  F |  S |\n`;
    md +=
      "| ------: | ----: | ----: | ----: | ----: | ----: | ----: | ----: |\n";

    for (let month = start; month <= end; month++) {
      let firstDay = firstDayOfWeek(year, month);
      let days = daysInMonth(year, month);
      let day = 1;

      let week = Array(7).fill("");
      for (let i = firstDay; i < 7 && day <= days; i++) {
        week[i] = day++;
      }
      md += `| **${monthNames[month].slice(0, 3).toUpperCase()}** | ${week.join(" | ")} |\n`;

      while (day <= days) {
        week = Array(7).fill("");
        for (let i = 0; i < 7 && day <= days; i++) {
          week[i] = day++;
        }
        md += `|          | ${week.join(" | ")} |\n`;
      }
    }
    md += `| **${qname}** | **S** | **M** | **T** | **W** | **T** | **F** | **S** |\n\n`;
  }
  return md;
}

// Yearly (all months in order, no quarterly labels)
function generateYearStyle(year) {
  let md = `## ${year}\n\n`;
  for (let month = 0; month < 12; month++) {
    md += `| ${monthNames[month].padEnd(9)} |  S |  M |  T |  W |  T |  F |  S |\n`;
    md += "|---------:|----:|----:|----:|----:|----:|----:|----:|\n";

    let firstDay = firstDayOfWeek(year, month);
    let days = daysInMonth(year, month);

    let day = 1;
    let week = Array(7).fill("");
    for (let i = firstDay; i < 7 && day <= days; i++) {
      week[i] = day++;
    }
    md += `|          | ${week.join(" | ")} |\n`;

    while (day <= days) {
      week = Array(7).fill("");
      for (let i = 0; i < 7 && day <= days; i++) {
        week[i] = day++;
      }
      md += `|          | ${week.join(" | ")} |\n`;
    }
    md += "\n";
  }
  return md;
}

// UI logic
document.getElementById("calendar-form").onsubmit = function (e) {
  e.preventDefault();
  var year = parseInt(document.getElementById("year").value, 10);
  var style = document.getElementById("style").value;
  var output = "";
  if (style === "month") output = generateMonthStyle(year);
  else if (style === "quarter") output = generateQuarterStyle(year);
  else output = generateYearStyle(year);
  document.getElementById("output").value = output;
};

// Copy to clipboard
document.getElementById("copy-btn").onclick = function () {
  var textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
};
