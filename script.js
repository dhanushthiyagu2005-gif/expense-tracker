let name = document.getElementById('ex-name');
let amount = document.getElementById('ex-amt');
let expenseList = document.getElementById('exp-list');
let totalSpan = document.getElementById('totalexpenses');
let dailylimitInput = document.getElementById('daily-limit');
let monthlylimitInput = document.getElementById('monthly-limit');
let categoryInput = document.getElementById('exp-category')


let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let Total = 0;
let dailyTotal = 0;
let monthlyTotal = 0;

let today = new Date().toISOString().split('T')[0];
let currentMonth = new Date().getMonth();


function addExpense() {

    let expenseName = name.value.trim();
    let expenseAmount = Number(amount.value);
    let catogory = categoryInput.value;

    if(!expenseName || !expenseAmount || !catogory) {
        alert("please enter the valid data");
        return;
    }
   let expense = {
    name: expenseName,
    amount: expenseAmount,
    categoryInput: catogory,
    date: today
   };

   expenses.push(expense);
   saveData();
   renderExpenses();
   renderCharts();
   renderMonthlySummary();
   renderMonthlyComparison();
   

    name.value = "";
    amount.value = "";
    categoryInput.value = "";
   

Total += expenseAmount;  
totalSpan.innerText = Total

dailyTotal += expenseAmount;
monthlyTotal += expenseAmount;

let dailyAmt = Number(dailylimitInput.value);
let monthlyAmt = Number(monthlylimitInput.value);

if(dailyAmt && dailyTotal > dailyAmt) {
    alert("You have exceeded your daily limit!");
}
if(monthlyAmt && monthlyTotal > monthlyAmt) {
    alert("You have exceeded your monthly limit!");
}

name.value = "";
amount.value = "";


}

function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));

}

function renderExpenses() {
  expenseList.innerHTML = "";
  Total = 0;

  [...expenses].reverse().forEach((exp, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <strong>${exp.categoryInput}</strong> | ${exp.name}- ₹${exp.amount}
      <small style="color:gray;">(${exp.date})</small>
      <button onclick="removeExpense(${expenses.length - 1 - index})">Delete</button>
    `;

    expenseList.appendChild(li);
    Total += exp.amount;
  });

  totalSpan.innerText = Total;
}


function removeExpense(index) {
expenses.splice(index, 1);
saveData(); 
renderExpenses();
renderCharts();
renderMonthlySummary()
renderMonthlyComparison();

}

function renderCharts() {

    let categoryTotals = {};
    let dailyTotals = {};

    expenses.forEach(exp => {

        if(categoryTotals[exp.categoryInput]){
            categoryTotals[exp.categoryInput] += exp.amount;
        }else{
            categoryTotals[exp.categoryInput] = exp.amount;
        }

        if(dailyTotals[exp.date]){
            dailyTotals[exp.date] += exp.amount;
        }else {
            dailyTotals[exp.date] = exp.amount;
        }
    });

    let catLabels = Object.keys(categoryTotals);
    let catData   = Object.values(categoryTotals);

    let dayLabels = Object.keys(dailyTotals);
    let dayData = Object.values(dailyTotals);

    let categoryChart;
    let dailyChart;


    if(categoryChart) categoryChart.destroy();
    if(dailyChart) dailyChart.destroy();

    categoryChart = new Chart (document.getElementById('categoryChart'),{

        type: 'pie',
        data: {
            labels: catLabels,
            datasets: [{
                data: catData
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }

    });

    dailyChart = new Chart (document.getElementById('dailyChart'), {
        type: 'bar',
        data: {
            labels: dayLabels,
            datasets: [{
                labels : 'Daily Expenses',
                data: dayData
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
        });
    }
        function renderMonthlySummary() {
            let summarydiv = document.getElementById('monthlySummary');
            let selectedMonth = document.getElementById('monthPicker').value;

            
             if (!selectedMonth) {
        summarydiv.innerHTML = "";
        return;
    }

    let [year, month] = selectedMonth.split("-");
    month = Number(month) - 1;

    let monthlyTotal = {};
    let monthTotalAmount = 0;

             expenses.forEach(exp => {
        let d = new Date(exp.date);

        if (d.getMonth() === month && d.getFullYear() == year) {
            monthTotalAmount += exp.amount;

            monthlyTotal[exp.categoryInput] =
                (monthlyTotal[exp.categoryInput] || 0) + exp.amount;
        }
    });
            let html = `<h4>Total Expenses for this month: ₹${monthTotalAmount}</h4>`;

            for(let cat in monthlyTotal){
                html += `<p>${cat}: ₹${monthlyTotal[cat]}</p>`;
            }
            summarydiv.innerHTML = html;

    };
    renderExpenses();
    renderCharts();
    renderMonthlySummary();
    renderMonthlyComparison();

    

    function renderMonthlyComparison() {
        let monthlySums = {};

        expenses.forEach(exp => {
            let monthkey = new Date(exp.date).toLocaleString('default', {month: 'short'});

            if(monthlySums[monthkey]){
                monthlySums[monthkey] += exp.amount;
            }else {
                monthlySums[monthkey] = exp.amount;
            }
        });
        let monthLabels = Object.keys(monthlySums);
        let monthData = Object.values(monthlySums);

        let monthlyComparisonChart;

        if(monthlyComparisonChart) monthlyComparisonChart.destroy();
    
        monthlyComparisonChart = new Chart(document.getElementById('monthlyComparisonChart'), {
            type: 'bar',
            data: {
                labels: monthLabels,
                datasets: [{
                    label : 'Monthly Expenses',
                    data: monthData
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    };
    renderMonthlyComparison();


 


  
