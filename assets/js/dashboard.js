function calculateEnergy() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  setTimeout(() => {
    const hours = parseFloat(document.getElementById("hours").value);
    const power = parseFloat(document.getElementById("power").value);

    const result = document.getElementById("result");
    const tip = document.getElementById("tip");

    if (isNaN(hours) || isNaN(power) || hours <= 0 || power <= 0) {
      result.innerHTML = "<span style='color:red'>Introduce valores válidos</span>";
      tip.innerText = "";
      loader.style.display = "none";
      return;
    }

    const energy = hours * power;

    result.innerHTML = "<strong>Energía generada: " + energy + " kWh/día</strong>";

    tip.innerText =
      energy > 20
        ? "Alta producción energética 🌞"
        : "Producción moderada ⚡";

    localStorage.setItem("lastEnergy", energy);
    localStorage.setItem("lastHours", hours);
    localStorage.setItem("lastPower", power);

    document.getElementById("card-energy").innerText = energy + " kWh";
    document.getElementById("card-hours").innerText = hours + " h";
    document.getElementById("card-power").innerText = power + " kW";
    document.getElementById("card-status").innerText =
      energy > 20 ? "Alta" : "Media";

    createChart(energy);

    loader.style.display = "none";
  }, 800);
}


// ===== CHART =====
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
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


window.addEventListener("load", function () {
  const savedEnergy = localStorage.getItem("lastEnergy");
  const savedHours = localStorage.getItem("lastHours");
  const savedPower = localStorage.getItem("lastPower");

  if (savedEnergy) {
    document.getElementById("result").innerHTML =
      "<em>Última energía calculada: " + savedEnergy + " kWh/día</em>";

    createChart(parseFloat(savedEnergy));

    document.getElementById("card-energy").innerText = savedEnergy + " kWh";
    document.getElementById("card-hours").innerText = savedHours + " h";
    document.getElementById("card-power").innerText = savedPower + " kW";
    document.getElementById("card-status").innerText =
      savedEnergy > 20 ? "Alta" : "Media";
  }
});