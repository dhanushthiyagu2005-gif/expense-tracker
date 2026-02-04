let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let dailyTotals = {};
let today = new Date().toISOString().split('T')[0];
let todayExpeses = expenses.filter(exp => exp.date === today);
// collect daily totals
expenses.forEach(exp => {
  if (!exp.date || !exp.amount) return;

  if (dailyTotals[exp.date]) {
    dailyTotals[exp.date] += Number(exp.amount);
  } else {
    dailyTotals[exp.date] = Number(exp.amount);
  }
});

let labels = Object.keys(dailyTotals);
let data = Object.values(dailyTotals);

if (labels.length === 0) {
  console.log("No expense data for dashboard");
} else {
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
}
// Calculate today's total expenses
let todayTotal = 0;

todayExpeses.forEach(exp => {
  todayTotal += Number(exp.amount);

});
document.getElementById("todayTotal").innerHTML = `₹ ${todayTotal}`;

let recentExpensesList = document.getElementById("recentExpenses");
let LastFive = [...expenses].reverse().slice(0, 5);

if(LastFive.length === 0) {
  recentExpensesList.innerHTML = `<li>No recent expenses</li>`
}else{
  recentExpensesList.innerHTML = "";

  LastFive.forEach(exp => {
    let li = document.createElement("li");
    li.innerText = `${exp.categoryInput} - ₹${exp.amount} on ${exp.date}`;
    recentExpensesList.appendChild(li);
  });
}
