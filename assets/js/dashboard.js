let productionChart;
let radiationChart;
let impactChart;
let roiChart;

function calculateEnergy() {
  const loader = document.getElementById("loader");
  const hours = parseFloat(document.getElementById("hours").value);
  const power = parseFloat(document.getElementById("power").value);
  const result = document.getElementById("result");
  const tip = document.getElementById("tip");

  loader.style.display = "block";

  setTimeout(() => {
    if (isNaN(hours) || isNaN(power) || hours <= 0 || power <= 0) {
      result.innerHTML = "<span style='color:#dc2626'>Introduce valores válidos.</span>";
      tip.innerText = "";
      loader.style.display = "none";
      return;
    }

    const energy = hours * power;

    result.innerHTML = "Energía generada: " + energy + " kWh/día";
    tip.innerText = energy > 20 ? "Alta producción energética 🌞" : "Producción moderada ⚡";

    document.getElementById("card-energy").innerText = energy + " kWh";
    document.getElementById("card-hours").innerText = hours + " h";
    document.getElementById("card-power").innerText = power + " kW";
    document.getElementById("card-status").innerText = energy > 20 ? "Alta" : "Media";

    localStorage.setItem("lastEnergy", energy);
    localStorage.setItem("lastHours", hours);
    localStorage.setItem("lastPower", power);

    updateCharts("hoy", energy);

    loader.style.display = "none";
  }, 700);
}

function showPeriod(period) {
  const savedEnergy = parseFloat(localStorage.getItem("lastEnergy")) || 15;
  updateCharts(period, savedEnergy);
}

function updateCharts(period, baseEnergy) {
  let labels;
  let productionData;
  let radiationData;

  if (period === "hoy") {
    labels = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    productionData = [2, 6, baseEnergy, baseEnergy - 2, 7, 3];
    radiationData = [150, 350, 750, 690, 420, 180];
  } else if (period === "7") {
    labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    productionData = [baseEnergy - 2, baseEnergy, baseEnergy + 3, baseEnergy - 1, baseEnergy + 4, baseEnergy + 1, baseEnergy - 3];
    radiationData = [420, 500, 620, 580, 710, 650, 490];
  } else {
    labels = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14"];
    productionData = [10, 12, 14, 16, 15, 18, 20, 19, 17, 16, 15, 18, 21, 20];
    radiationData = [380, 410, 450, 500, 540, 580, 620, 610, 590, 560, 520, 600, 650, 670];
  }

  createProductionChart(labels, productionData);
  createRadiationChart(labels, radiationData);
  createImpactChart();
  createRoiChart();
}

function createProductionChart(labels, data) {
  const ctx = document.getElementById("productionChart").getContext("2d");

  if (productionChart) productionChart.destroy();

  productionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Producción kWh",
        data: data,
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.15)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function createRadiationChart(labels, data) {
  const ctx = document.getElementById("radiationChart").getContext("2d");

  if (radiationChart) radiationChart.destroy();

  radiationChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Radiación W/m²",
        data: data,
        backgroundColor: "#3B82F6"
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

function createImpactChart() {
  const ctx = document.getElementById("impactChart").getContext("2d");

  if (impactChart) impactChart.destroy();

  impactChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Producción", "Pérdidas", "Clima"],
      datasets: [{
        data: [65, 20, 15],
        backgroundColor: ["#10B981", "#F59E0B", "#3B82F6"]
      }]
    },
    options: {
      responsive: true
    }
  });
}

function createRoiChart() {
  const ctx = document.getElementById("roiChart").getContext("2d");

  if (roiChart) roiChart.destroy();

  roiChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Año 1", "Año 5", "Año 10", "Año 15", "Año 20"],
      datasets: [{
        label: "Ahorro acumulado (€)",
        data: [500, 3500, 8500, 14500, 22000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.12)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");

  const btn = document.getElementById("mode-btn");
  if (document.body.classList.contains("dark-mode")) {
    btn.innerHTML = '<i class="fa fa-sun-o"></i> Modo claro';
    localStorage.setItem("mode", "dark");
  } else {
    btn.innerHTML = '<i class="fa fa-moon-o"></i> Modo oscuro';
    localStorage.setItem("mode", "light");
  }
}

window.addEventListener("load", function () {
  const savedEnergy = localStorage.getItem("lastEnergy");
  const savedHours = localStorage.getItem("lastHours");
  const savedPower = localStorage.getItem("lastPower");

  if (savedEnergy) {
    document.getElementById("card-energy").innerText = savedEnergy + " kWh";
    document.getElementById("card-hours").innerText = savedHours + " h";
    document.getElementById("card-power").innerText = savedPower + " kW";
    document.getElementById("card-status").innerText = savedEnergy > 20 ? "Alta" : "Media";
    document.getElementById("result").innerHTML = "Última energía calculada: " + savedEnergy + " kWh/día";
  }

  if (localStorage.getItem("mode") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("mode-btn").innerHTML = '<i class="fa fa-sun-o"></i> Modo claro';
  }

  updateCharts("hoy", parseFloat(savedEnergy) || 15);
});

function changeTab(btn, period) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  showPeriod(period);
}