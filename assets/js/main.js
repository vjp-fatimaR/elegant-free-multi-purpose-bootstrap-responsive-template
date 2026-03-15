document.addEventListener("DOMContentLoaded", function () {
  fetch("assets/data/servicios.json")
    .then(response => response.json())
    .then(servicios => {
      const serviceTitles = document.querySelectorAll("#services .media-heading");
      const serviceTexts = document.querySelectorAll("#services .media-body p");

      servicios.forEach((servicio, index) => {
        if (serviceTitles[index]) {
          serviceTitles[index].textContent = servicio.titulo;
        }
        if (serviceTexts[index]) {
          serviceTexts[index].textContent = servicio.descripcion;
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar servicios.json:", error);
    });
});
const navLinks = document.querySelectorAll(".navbar-nav li");

navLinks.forEach((item) => {
  item.addEventListener("click", function () {
    navLinks.forEach((li) => li.classList.remove("active"));
    this.classList.add("active");
  });
});
const menuItems = document.querySelectorAll(".navbar-nav li");

const sections = [
  { id: "home", menuText: "Inicio" },
  { id: "services", menuText: "Servicios" },
  { id: "projects", menuText: "Proyectos" },
  { id: "about", menuText: "Sobre Nosotros" },
  { id: "contact-us", menuText: "Contacto" }
];

function setActiveMenuBySection() {
  let current = "home";
  const scrollPosition = window.scrollY + 250;

  sections.forEach((section) => {
    const el = document.getElementById(section.id);
    if (el && scrollPosition >= el.offsetTop) {
      current = section.menuText;
    }
  });

  menuItems.forEach((item) => {
    item.classList.remove("active");
    const link = item.querySelector("a");
    if (link && link.textContent.trim() === current) {
      item.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveMenuBySection);
window.addEventListener("load", setActiveMenuBySection);

menuItems.forEach((item) => {
  item.addEventListener("click", function () {
    menuItems.forEach((li) => li.classList.remove("active"));
    this.classList.add("active");
  });
});