let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

//                  DOM elements 
const balanceEl = document.getElementById("balance");
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const monthlyIncomeEl = document.getElementById("monthlyIncome");
const monthlyExpenseEl = document.getElementById("monthlyExpense");
const filterMonth = document.getElementById("filterMonth");
const filterCategory = document.getElementById("filterCategory");

//            Adding a new transaction
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("transactionName").value.trim();
  const amount = parseFloat(document.getElementById("transactionAmount").value);
  const type = document.getElementById("transactionType").value;
  const date = document.getElementById("transactionDate").value;
  const category = document.getElementById("transactionCategory").value.trim() || "General";

  if(!name || !amount || amount <= 0 || !date){
    alert("Please enter valid data");
    return;
  }

  const transaction = {
    id: Date.now(),
    name,
    amount,
    type,
    date,
    category
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  transactionForm.reset();
  renderTransactions();
});

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
}

// Calculate balance
function calculateBalance(filtered = transactions) {
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  balanceEl.textContent = (income - expense).toFixed(2);

  // Monthly summary
  monthlyIncomeEl.textContent = income.toFixed(2);
  monthlyExpenseEl.textContent = expense.toFixed(2);
}

// Render transactions
function renderTransactions(filtered = transactions) {
  transactionList.innerHTML = "";

  filtered.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item");
    li.innerHTML = `
      <span>${t.name} (${t.category}) - ${t.date}</span>
      <span class="${t.type}">${t.type === "income" ? "+" : "-"}₹${t.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">X</button>
    `;
    transactionList.appendChild(li);
  });

  calculateBalance(filtered);
}

// Apply filters
document.getElementById("applyFilters").addEventListener("click", () => {
  let filtered = [...transactions];

  if (filterMonth.value) {
    filtered = filtered.filter((t) => t.date.startsWith(filterMonth.value));
  }

  if (filterCategory.value.trim()) {
    filtered = filtered.filter((t) =>
      t.category.toLowerCase().includes(filterCategory.value.toLowerCase())
    );
  }

  renderTransactions(filtered);
});

// Clear filters
document.getElementById("clearFilters").addEventListener("click", () => {
  filterMonth.value = "";
  filterCategory.value = "";
  renderTransactions();
});

// Export CSV
document.getElementById("exportCSV").addEventListener("click", () => {
  let csv = "Name,Amount,Type,Date,Category\n";
  transactions.forEach((t) => {
    csv += `${t.name},${t.amount},${t.type},${t.date},${t.category}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Initial render
renderTransactions();