function calculateEnergy() {
  const hours = parseFloat(document.getElementById("hours").value);
  const power = parseFloat(document.getElementById("power").value);

  const result = document.getElementById("result");

  if (isNaN(hours) || isNaN(power) || hours <= 0 || power <= 0) {
    result.innerHTML = "<span style='color:red'>Introduce valores válidos (números mayores que 0)</span>";
    return;
  }

  const energy = hours * power;

  result.innerHTML = "<strong>Energía generada: " + energy + " kWh/día</strong>";

  localStorage.setItem("lastEnergy", energy);

  createChart(energy);
}


function createChart(energy) {
  const ctx = document.getElementById("energyChart").getContext("2d");

  if (window.chart) {
    window.chart.destroy();
  }

  window.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Producción diaria"],
      datasets: [{
        label: "kWh",
        data: [energy],
        backgroundColor: "#10B981"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


window.addEventListener("load", function () {
  const saved = localStorage.getItem("lastEnergy");

  if (saved) {
    document.getElementById("result").innerHTML =
      "<em>Última energía calculada: " + saved + " kWh/día</em>";
  }
});