let name = document.getElementById('ex-name');
let amount = document.getElementById('ex-amt');
let expenseList = document.getElementById('exp-list');
let totalSpan = document.getElementById('totalexpenses');
let dailylimitInput = document.getElementById('daily-limit');
let monthlylimitInput = document.getElementById('monthly-limit');
let categoryInput = document.getElementById('exp-category');


let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let Total = 0;
let dailyTotal = 0;
let monthlyTotal = 0;

let today = new Date().toISOString().split('T')[0];
let currentMonth = new Date().getMonth();

let categoryChart = null;
let dailyChart = null;
let monthlyComparisonChart = null;


function addExpense() {

    let todayExp = new Date().toISOString().split("T")[0];


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
    date: todayExp
   };

   if(editIndex === -1) {
    expenses.push(expense);
   }else {
    expenses[editIndex] = expense;
    editIndex = -1;
    addbtn.innerText = "Add Expense";
   }

   saveData();
   renderExpenses();
   renderCharts();
   renderMonthlySummary();
   renderMonthlyComparison();
   

    name.value = "";
    amount.value = "";
    categoryInput.value = "";
   

let today = new Date().toISOString().split("T")[0];

function getMonthlyTotal() {
    let now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    let total = 0;

    expenses.forEach(exp => {
        let d = new Date(exp.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            total += Number(exp.amount);
        }
    });

    return total;
}


let dailyAmt = Number(dailylimitInput.value);
let todayTotal = getTodayTotal();
let monthlyAmt = Number(monthlylimitInput.value);
let monthlyTotal = getMonthlyTotal();

if(dailyAmt && todayTotal > dailyAmt) {
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

  let list = document.getElementById("exp-list");
  let totalSpan = document.getElementById("totalexpenses");
  let filter = document.getElementById("filterType").value;

  list.innerHTML = "";

  let today = new Date().toISOString().split("T")[0];
  let now = new Date();
  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();

  let filteredExpenses = expenses;

  if (filter === "today") {
    filteredExpenses = expenses.filter(exp => exp.date === today);
  }

  if (filter === "month") {
    filteredExpenses = expenses.filter(exp => {
      let expDate = new Date(exp.date);
      return (
        expDate.getMonth() === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    });
  }

  let total = 0;

  if (filteredExpenses.length === 0) {
    list.innerHTML = "<li>No expenses found</li>";
    totalSpan.innerText = 0;   
    return;
  }

  filteredExpenses.slice().reverse().forEach((exp) => {

    total += Number(exp.amount);  

    let li = document.createElement("li");
    li.textContent = `${exp.name} - ₹${exp.amount} (${exp.categoryInput}) on ${exp.date}`;
    list.appendChild(li);
  });

  totalSpan.innerText = total;   
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

    function exportToExcel() {
        if(expenses.length === 0) {
            alert("No expenses to export!");
            return;
        }

        let excelData = expenses.map(exp => ({
            "Expense Name" : exp.name,
            "Amount" : exp.amount,
            "Category" : exp.category,
            "Date" : exp.date
        }));

        let totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        excelData.push({
            "Expense Name" : "Total",
            "Amount" : totalAmount,
            "Category" : "",
            "Date" : ""
        });

        let worksheet = XLSX.utils.json_to_sheet(excelData);
        let workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, worksheet, "Expenses");

        XLSX.writeFile(workBook, "Expenses.XLSX");
        expenses.innerHTML = Total;
    }

let editIndex = -1;
let addbtn = document.getElementById('addBtn')

function editExpense(index) {
    editIndex = index;

    name.value = expenses[index].name;
    amount.value = expenses[index].amount;
    categoryInput.value = expenses[index].categoryInput;

    addbtn.innerText = "Updated Expense";
}

let categories = JSON.parse(localStorage.getItem("categories")) || ["Food", "Travel", "Shopping","EMI", "Other"];

function renderCategories() {
    categoryInput.innerHTML = `<option value ="">Select Cotrgory</option>`

    categories.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryInput.appendChild(option);
    });
}

function addCustomCategory() {
    let newCat = document.getElementById('customCategory').value.trim();

    if(!newCat) {
        alert("Please enter a valid category name");
        return;
    }
    if(categories.includes(newCat)){
        alert("Category already exists!");
        return;
    }
    categories.push(newCat);
    localStorage.setItem("categories", JSON.stringify(categories));

    renderCategories();
    categoryInput.value = newCat;

    document.getElementById('customCategory').value = "";
}
function deleteCustomCategory() {
    let selectedCat = categoryInput.value;

    if(!selectedCat) {
        alert("Please select a category to delete!");
        return;
    }
    let defaultCats = ["Food", "Travel", "Shopping","EMI", "Other"];
    if(defaultCats.includes(selectedCat)){
        alert("Default categories cannot be deleted!");
        return;
    }
    let isUsed = expenses.some(exp => exp.categoryInput === selectedCat);

    if(isUsed){
        alert("Cannot delete category in use!");
        return;
    }

    categories = categories.filter(cat => cat !== selectedCat);
    localStorage.setItem("categories", JSON.stringify(categories));

    renderCategories();
    categoryInput.value = "";
    
    alert("Category deleted successfully!");

}

let monthlyLimitInput = document.getElementById('monthly-limit');

let savedMonthlyLimit = localStorage.getItem("monthlyLimit");
if(savedMonthlyLimit) {
    monthlyLimitInput.value = savedMonthlyLimit;
}

monthlyLimitInput.addEventListener("change", function() {
    localStorage.setItem("monthlyLimit", monthlyLimitInput.value);
});

let crtMonth = new Date().getMonth();
let savedMonth = localStorage.getItem('savedMonth');

if(savedMonth === null ) {
    localStorage.setItem('savedMonth', crtMonth);
} else if(Number(savedMonth) !== crtMonth) {

    expenses = [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("savedMonth", crtMonth);

    alert("New month detected! Expenses have been reset.");
}

const dailyInput = document.getElementById("daily-limit");
const monthlyInput = document.getElementById("monthly-limit");

// Load saved values
if (localStorage.getItem("dailyLimit")) {
  dailyInput.value = localStorage.getItem("dailyLimit");
}

if (localStorage.getItem("monthlyLimit")) {
  monthlyInput.value = localStorage.getItem("monthlyLimit");
}

dailyInput.addEventListener("input", function () {
  localStorage.setItem("dailyLimit", dailyInput.value);
});

monthlyInput.addEventListener("input", function () {
  localStorage.setItem("monthlyLimit", monthlyInput.value);
});

function getTodayTotal() {
    let today = new Date().toISOString().split("T")[0];

    let todayTotal = expenses.filter(exp => exp.date === today);

    let total = 0;
    todayTotal.forEach(exp => {

        total += exp.amount;
    });
    return total;
}



 


  
