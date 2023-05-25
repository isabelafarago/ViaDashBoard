//-------------------- Charts responsible to catch the data from all employees sales --------------------
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const employeeSales = data.map(employee => employee.liquido);
    const employeeNames = data.map(employee => employee.nome);
    const filteredEmployeeSales = []; const filteredEmployeeNames = [];

    for (let i = 0; i < employeeSales.length; i++) {
      filteredEmployeeSales.push(employeeSales[i]);
         filteredEmployeeNames.push(employeeNames[i]);
    }
    // Calculate the minimum sales value
    const minSales = Math.min(...employeeSales);
    const ctx = document.getElementById('employeeChart').getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredEmployeeNames, 
        datasets: [{
          label: 'Employee Sales',
          data: filteredEmployeeSales, 
          backgroundColor: '#2a2fc7',
          borderWidth: 1,
          borderRadius: 25
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            min: 0, 
            ticks: {
              stepSize: 10000,
              color: '#ffff'
            },
          },
          x: {
            ticks: {
              stepSize: 0,
              color: '#ffff'
            },
            beginAtZero: true
          }
        }
      }
    });
  })
  .catch(error => console.error(error));



//-------------------- PieCharts responsible to catch the data from all employees sales --------------------
fetch('data2.json')
  .then(response => response.json())
  .then(data => {
    const paymentMethodTotals = {};
    data.forEach(employee => {
      const paymentMethodName = employee.nome;
      const paymentMethodTotal = employee.total;

      if (!paymentMethodTotals[paymentMethodName]) {
        paymentMethodTotals[paymentMethodName] = 0;
      }
      paymentMethodTotals[paymentMethodName] += paymentMethodTotal;
    });

    const paymentMethodNames = Object.keys(paymentMethodTotals);
    const paymentMethodTotalsData = Object.values(paymentMethodTotals);
    const ctx = document.getElementById('paymentMethodChart').getContext('2d');
  
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: paymentMethodNames,
          datasets: [{
            label: 'Employee Sales by Payment Method',
            data: paymentMethodTotalsData,
            backgroundColor: [
              '#653CD5',
              '#C389F3',
              '#D86375',
              '#6BC5BB',
              '#F1A861',
              '#db3f9a'
            ],
            borderColor: [
              '#653CD5',
              '#C389F3',
              '#D86375',
              '#6BC5BB',
              '#F1A861',
              '#db3f9a'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              ticks: {
                color: '#2E3442'
              },
              beginAtZero: true
            },
            x: {
              ticks: {
                color: '#2E3442'
              },
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(error => console.error(error));
  
  //-------------------- employees list in the other page --------------------
 document.addEventListener("DOMContentLoaded", function() {
    const employeeData = document.getElementById("employeeData");
    const backButton = document.getElementById("backButton");
    
    function showEmployeeDetails(employeeId) {
      fetch("data.json")
        .then(response => response.json())
        .then(data => {
          const employeeDetails = data.find(detail => detail.id == employeeId);
          
          // HTML for the employee details no the emplooye page
          const employeeDetailsHtml =
            `<div class="card">
              <h2>ID: ${employeeDetails.id} ${employeeDetails.nome}</h2>
              <p>BRUTO   - R$${employeeDetails.bruto}</p>
              <p>LÍQUIDO - R$${employeeDetails.liquido}</p>
              <img src="${employeeDetails.image_url}" alt="Employee Image">
            </div>`;
            employeeData.innerHTML = employeeDetailsHtml;
          backButton.style.display = "block";
        });
    }
    // to show the employee list
    function showEmployeeList() {
      fetch("data.json")
        .then(response => response.json())
        .then(data => {
          const employeeList = data.map(employee => `<li class="employee" data-id="${employee.id}">${employee.nome}</li>`).join("");
          employeeData.innerHTML = `
            <h2 class = 'title_employee'>Funcionários</h2>
            <ul>${employeeList}</ul>`;
          // Hide the go back bottom
          backButton.style.display = "none";
        });
    }
    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        const employeeList = data.map(employee => `<li class="employee" data-id="${employee.id}">${employee.nome}</li>`).join("");
        employeeData.innerHTML = `
          <h2 class = 'title_employee'>Funcionários</h2>
          <ul>${employeeList}</ul>`;
      });
    // event listener to handle clicks on employees
    employeeData.addEventListener("click", function(event) {
      if (event.target.classList.contains("employee")) {
        const employeeId = event.target.getAttribute("data-id");
        showEmployeeDetails(employeeId);
      }
    });
    backButton.addEventListener("click", function() {
      showEmployeeList();
    });
  });

  //--------------------Sum of sales based on product types --------------------
fetch("data3.json")
    .then(function (response) {
    return response.json();
  })
   .then(function (jsonData) {
    const idTotals = {}; const idNames = {};
    jsonData.forEach(function (array) {
      array.forEach(function (item) {
        if (idTotals[item.id]) {
          idTotals[item.id] += item.total;
        } else {
          idTotals[item.id] = item.total;
        }
        idNames[item.id] = item.nome; 
      });
    });
    const sortedIds = Object.keys(idTotals).sort(function (a, b) {
      return idTotals[b] - idTotals[a];
    });
    const chartData = {
      labels: sortedIds.map(function (id) {
        return idNames[id]; 
      }),
      datasets: [
        {
          label: "Total Sum",
          data: sortedIds.map(function (id) {
            return idTotals[id];
          }),
          backgroundColor: [
            "#3EB1FC",
            "#58D6C5",
            "#FF306A",
            "#FBCE23",
            "#6741A4",
            "#C6E74E",
            "#FF7F00",
            "#8B008B",
            "#00CED1",
            "#FF1493"
          ],
          borderWidth: 1,
          borderRadius: 25
        },
      ],
    };
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffff'
            }
          },
          x: {
            ticks: {
              stepSize: 10000,
              color: '#ffff'
            },
          },
        },
      },
    });
  })
  .catch(function (error) {
    console.error("Error reading the JSON file:", error);
  });
  
  //----------------------------- line chart based on the sales throughout the year ------------------------------
  fetch('data4.json')
      .then(response => response.json())
      .then(data => {
        const products = Object.keys(data);
        const months = Object.keys(data[products[0]]);
        const datasets = products.map(product => ({
          label: product,
          data: months.map(month => data[product][month])
        }));
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: months,
            datasets: datasets
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: 'Product Sales Track'
            }
        }
    });
});
