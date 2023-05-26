//-------------------- Charts responsible to catch the data from all employees sales --------------------
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    const employeeSales = data.map(employee => employee.liquido);
    const employeeNames = data.map(employee => employee.nome);
    const filteredEmployeeSales = [];
    const filteredEmployeeNames = [];

    for (let i = 0; i < employeeSales.length; i++) {
      filteredEmployeeSales.push(employeeSales[i]);
      filteredEmployeeNames.push(employeeNames[i]);
    }
    const minSales = Math.min(...employeeSales);
    const ctx = document.getElementById('employeeChart').getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredEmployeeNames,
        datasets: [{
          label: 'Vendas: ',
          data: filteredEmployeeSales,
          backgroundColor: [
            '#353CD5',
            '#C389F3',
            '#D86375',
            '#6BC5BB',
            '#F1A861',
            '#D845375',
          ],
          borderWidth: 0,
          borderColor: 'black',
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
              stepSize: 1, 
              color: '#ffff'
            }
          },
          x: {
            ticks: {
              min: 0,
              stepSize: 1,
              color: '#fff'
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: "white",
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Ranking dos funcionários',
            align: "start",
            color: 'white',
            font: {
              size: 16,
              family: 'Arial',
              weight: 'bold'
            }
          }
        }
      }
    });

  })
  .catch(error => console.error(error));


//-------------------- PieCharts responsible to catch the data from all employees sales --------------------
fetch('data/data2.json')
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
          label: "",
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
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              color: 'white'
            },
            beginAtZero: true
          },
          x: {
            ticks: {
              color: 'white'
            },
            beginAtZero: true
          }
        },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: "white",
                font: {
                  size: 11
                }
              }
            },
          title: {
            display: true,
            text: 'Formas de pagamento mais usadas',
            align: 'start',
            color: 'white', 
            padding: {
              top: 10,
              bottom: 10
            },
            font: {
              size: 16,
              weight: 'bold'
            }
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
      fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
          const employeeDetails = data.find(detail => detail.id == employeeId);
          const employeeDetailsHtml =
            `<div class="card">
              <h2> ${employeeDetails.nome} (ID: ${employeeDetails.id})</h2>
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
      fetch("data/data.json")
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
    fetch("data/data.json")
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
  fetch("data/data3.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonData) {
    const idTotals = {};
    const idNames = {};
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
          label: "Noo presente mês: ",
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
            "#FF1493",
          ],
          borderWidth: 1,
          borderRadius: 25,
        },
      ],
    };
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        indexAxis: "y", 
        plugins: {
          legend: {
            display: false, 
          },
          title: {
            display: true,
            text: "Ranking de vendas dos produtos no mês",
            position: "left",
            color: 'white',
            font: {
              size: 16,
              family: "Arial",
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#ffff",
            },
          },
          x: {
            ticks: {
              stepSize: 10000,
              color: "#ffff",
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
fetch('data/data4.json')
  .then(response => response.json())
  .then(data => {
    const products = Object.keys(data);
    const months = Object.keys(data[products[0]]);
    const colorScheme = [
      "#008744",
      "#001eff",
      "#FF306A",
      "#FBCE23",
      "#FFA700",
      "#C6E74E",
      "#FF7F00",
      "#8B008B",
      "#00CED1",
      "#d62d20",
    ];
    const datasets = products.map((product, index) => ({
      label: product,
      data: months.map(month => data[product][month]),
      borderColor: colorScheme[index],
      backgroundColor: colorScheme[index],
      fill: false,
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
        elements: {
          line: {
            borderWidth: 2
          }
        },
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
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: "white",
                font: {
                  size: 11
                }
              },
              boxWidth: 0
            },
          title: {
            display: true,
            text: 'Nichos mais vendidos durante o ano',
            align: 'start',
            position: 'top',
            color: 'white',
            font: {
              size: 16,
              family: "Arial",
              weight: "bold",
            },
          }
        }
      }
    });
  })

//-----------------------make the changing theme static --------------------------------------------------
  const checkbox = document.getElementById('theme');
  const body = document.body;
  function applyTheme() {
      if (checkbox.checked) {
         body.classList.add('light-mode');
        } else {
         body.classList.remove('light-mode');
    }
  }
    function setThemePreference() {
        localStorage.setItem('theme', checkbox.checked ? 'light' : 'dark');
    applyTheme();
  }
    function getThemePreference() {
       const theme = localStorage.getItem('theme');
        if (theme === 'light') {
        checkbox.checked = true;
         } else {
         checkbox.checked = false;
    }
    applyTheme();
  }
  checkbox.addEventListener('change', setThemePreference);
  window.addEventListener('DOMContentLoaded', getThemePreference);
  
