let incomeSources = [];
let expenseSources = [];
const entries = [];

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const businessName = document.getElementById("businessName").value.trim();
    incomeSources = document.getElementById("incomeSources").value.split(",").map(s => s.trim()).filter(Boolean);
    expenseSources = document.getElementById("expenseSources").value.split(",").map(s => s.trim()).filter(Boolean);

    if (businessName && incomeSources.length && expenseSources.length) {
        document.getElementById("displayBusinessName").textContent = `🌿 ${businessName} Finance Tracker`;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";
        populateDescOptions(); // Populate dropdown on show
    }
});

document.getElementById("type").addEventListener("change", populateDescOptions);

function populateDescOptions() {
    const type = document.getElementById("type").value;
    const descSelect = document.getElementById("desc");
    descSelect.innerHTML = "";
    const sources = type === "Income" ? incomeSources : expenseSources;
    sources.forEach(source => {
        const option = document.createElement("option");
        option.value = source;
        option.textContent = source;
        descSelect.appendChild(option);
    });
}

document.getElementById("financeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);

    entries.push({
        type,
        desc,
        amount
    });
    updateUI();
    this.reset();
    populateDescOptions(); // Reset desc options after form reset
});

function updateUI() {
    let totalIncome = 0,
    totalExpense = 0;
    const entriesDiv = document.getElementById("entries");
    entriesDiv.innerHTML = "";

    // Group and sum by desc for Income
    const incomeMap = {};
    entries.filter(e => e.type === "Income").forEach(entry => {
        if (!incomeMap[entry.desc]) {
            incomeMap[entry.desc] = 0;
        }
        incomeMap[entry.desc] += entry.amount;
        totalIncome += entry.amount;
    });

    // Group and sum by desc for Expense
    const expenseMap = {};
    entries.filter(e => e.type === "Expense").forEach(entry => {
        if (!expenseMap[entry.desc]) {
            expenseMap[entry.desc] = 0;
        }
        expenseMap[entry.desc] += entry.amount;
        totalExpense += entry.amount;
    });

    // Create Income Table
    const incomeTable = document.createElement("table");
    incomeTable.style.width = "48%";
    incomeTable.style.background = "#e8f5e9";
    incomeTable.style.border = "2px solid #388e3c";
    incomeTable.style.borderRadius = "8px";
    incomeTable.style.marginRight = "2%";
    incomeTable.style.display = "inline-block";										   
    incomeTable.innerHTML = `
      <thead>
        <tr>
          <th style="border-bottom:1px solid #bbb; text-align:left; padding:8px; color:#2e7d32;">Income Source</th>
          <th style="border-bottom:1px solid #bbb; text-align:right; padding:8px; color:#2e7d32;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const incomeTbody = incomeTable.querySelector("tbody");
    Object.entries(incomeMap).forEach(([desc, amount]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${desc}</td>
          <td style="text-align:right;">${amount.toFixed(2)}</td>
        `;
        incomeTbody.appendChild(row);
    });

    // Create Expense Table
    const expenseTable = document.createElement("table");
    expenseTable.style.width = "48%";
    expenseTable.style.background = "#ffebee";
    expenseTable.style.border = "2px solid #c62828";
    expenseTable.style.borderRadius = "8px";
    expenseTable.style.display = "inline-block";
    expenseTable.innerHTML = `
      <thead>
        <tr>
          <th style="border-bottom:1px solid #bbb; text-align:left; padding:8px; color:#c62828;">Expense Source</th>
          <th style="border-bottom:1px solid #bbb; text-align:right; padding:8px; color:#c62828;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const expenseTbody = expenseTable.querySelector("tbody");
    Object.entries(expenseMap).forEach(([desc, amount]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${desc}</td>
          <td style="text-align:right;">${amount.toFixed(2)}</td>
        `;
        expenseTbody.appendChild(row);
    });

    // Add both tables side by side in a wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "entries-tables-wrapper";
    wrapper.appendChild(incomeTable);
    wrapper.appendChild(expenseTable);
    entriesDiv.appendChild(wrapper);

    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("netBalance").textContent = (totalIncome - totalExpense).toFixed(2);
}
