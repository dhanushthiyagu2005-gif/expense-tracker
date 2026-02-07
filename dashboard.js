



let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ---------- DAILY BAR CHART ----------
let dailyTotals = {};
let today = new Date().toISOString().split("T")[0];
let todayExpenses = expenses.filter(exp => exp.date === today);

// Collect daily totals
expenses.forEach(exp => {
  if (!exp.date || !exp.amount) return;

  dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + Number(exp.amount);
});

let labels = Object.keys(dailyTotals);
let data = Object.values(dailyTotals);

if (labels.length > 0) {
  new Chart(document.getElementById("dailyDashboardChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Daily Expenses (₹)",
        data: data
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
} else {
  console.log("No expense data for dashboard");
}

// ---------- TODAY TOTAL ----------
let todayTotal = 0;
todayExpenses.forEach(exp => {
  todayTotal += Number(exp.amount);
});

let todayTotalEl = document.getElementById("todayTotal");
if (todayTotalEl) {
  todayTotalEl.innerHTML = `₹ ${todayTotal}`;
}

// ---------- RECENT 5 EXPENSES ----------
let recentExpensesList = document.getElementById("recentExpenses");
let lastFive = [...expenses].reverse().slice(0, 5);

if (recentExpensesList) {
  if (lastFive.length === 0) {
    recentExpensesList.innerHTML = `<li>No recent expenses</li>`;
  } else {
    recentExpensesList.innerHTML = "";
    lastFive.forEach(exp => {
      let li = document.createElement("li");
      li.innerText = `${exp.categoryInput} - ₹${exp.amount} on ${exp.date}`;
      recentExpensesList.appendChild(li);
    });
  }
}


