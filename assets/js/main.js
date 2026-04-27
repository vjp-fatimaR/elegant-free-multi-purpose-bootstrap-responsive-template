document.addEventListener("DOMContentLoaded", function () {
  loadServices();
  setupMenuActiveState();
  setupContactFormValidation();
});

function loadServices() {
  fetch("assets/data/servicios.json")
    .then(response => response.json())
    .then(servicios => {
      const serviceTitles = document.querySelectorAll("#services .media-heading");
      const serviceTexts = document.querySelectorAll("#services .media-body p");

      servicios.forEach((servicio, index) => {
        if (serviceTitles[index]) serviceTitles[index].textContent = servicio.titulo;
        if (serviceTexts[index]) serviceTexts[index].textContent = servicio.descripcion;
      });
    })
    .catch(error => console.error("Error al cargar servicios.json:", error));
}

function setupMenuActiveState() {
  const menuItems = document.querySelectorAll(".navbar-nav li");

  const sections = [
    { id: "home", menuText: "Inicio" },
    { id: "services", menuText: "Servicios" },
    { id: "projects", menuText: "Proyectos" },
    { id: "about", menuText: "Sobre Nosotros" },
    { id: "contact-us", menuText: "Contacto" }
  ];

  function setActiveMenuBySection() {
    let current = "Inicio";
    const scrollPosition = window.scrollY + 250;

    sections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el && scrollPosition >= el.offsetTop) current = section.menuText;
    });

    menuItems.forEach(item => {
      item.classList.remove("active");
      const link = item.querySelector("a");
      if (link && link.textContent.trim() === current) item.classList.add("active");
    });
  }

  window.addEventListener("scroll", setActiveMenuBySection);
  window.addEventListener("load", setActiveMenuBySection);
}

function setupContactFormValidation() {
  const form = document.getElementById("main-contact-form");
  if (!form) return;

  const nombre = document.getElementById("nombre");
  const empresa = document.getElementById("empresa");
  const tipoProyecto = document.getElementById("tipoProyecto");
  const mensaje = document.getElementById("mensaje");

  const formStatus = document.getElementById("form-status");
  const minCounter = document.getElementById("min-counter");
  const maxCounter = document.getElementById("max-counter");
  const wordCounter = document.getElementById("word-counter");

  nombre.addEventListener("blur", validateNombre);
  tipoProyecto.addEventListener("change", validateTipoProyecto);
  mensaje.addEventListener("input", function () {
    updateCounters();
    validateMensaje();
  });
  mensaje.addEventListener("blur", validateMensaje);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const v1 = validateNombre();
    const v2 = validateTipoProyecto();
    const v3 = validateMensaje();

    if (v1 && v2 && v3) {
      const formData = {
        nombre: nombre.value.trim(),
        empresa: empresa.value.trim(),
        tipoProyecto: Array.from(tipoProyecto.selectedOptions).map(opt => opt.value),
        mensaje: mensaje.value.trim()
      };

      localStorage.setItem("ecopulse_contact_form", JSON.stringify(formData));

      formStatus.className = "form-status success";
      formStatus.textContent = "Formulario enviado correctamente.";

      formStatus.className = "form-status success";

    const formData = {
      nombre: nombre.value.trim(),
      empresa: empresa.value.trim(),
      tipoProyecto: Array.from(tipoProyecto.selectedOptions).map(opt => opt.value),
      mensaje: mensaje.value.trim()
    };

formStatus.innerHTML = `
  <strong>✅ Formulario enviado correctamente</strong><br><br>
  <pre style="text-align:left; background:#111; color:#0f0; padding:10px;">
${JSON.stringify(formData, null, 2)}
  </pre>
`;
    } else {
      formStatus.className = "form-status error";
      formStatus.textContent = "Corrige los errores antes de enviar.";
    }
  });

  function validateNombre() {
    if (nombre.value.trim() === "") {
      setError(nombre, "nombre-feedback", "El nombre es obligatorio.");
      return false;
    }
    setSuccess(nombre, "nombre-feedback", "OK");
    return true;
  }

  function validateTipoProyecto() {
    const selected = tipoProyecto.selectedOptions.length;

    if (selected < 2) {
      setError(tipoProyecto, "tipoProyecto-feedback", "Selecciona al menos 2 opciones.");
      return false;
    }

    setSuccess(tipoProyecto, "tipoProyecto-feedback", "OK");
    return true;
  }

  function validateMensaje() {
    const text = mensaje.value.trim();
    const cleanText = text.replace(/\s+/g, " ");
    const words = cleanText === "" ? [] : cleanText.split(" ").filter(w => w.length > 0);

    if (cleanText.length < 30) {
      setError(mensaje, "mensaje-feedback", "Mínimo 30 caracteres.");
      return false;
    }

    if (cleanText.length > 1000) {
      setError(mensaje, "mensaje-feedback", "Máximo 1000 caracteres.");
      return false;
    }

    if (words.length < 4) {
      setError(mensaje, "mensaje-feedback", "Mínimo 4 palabras.");
      return false;
    }

    setSuccess(mensaje, "mensaje-feedback", "OK");
    return true;
  }

  function updateCounters() {
    const text = mensaje.value.trim().replace(/\s+/g, " ");
    const chars = text.length;
    const words = text === "" ? [] : text.split(" ").filter(w => w.length > 0);
    const wordCount = words.length;

    minCounter.textContent =
      chars < 30 ? `Faltan ${30 - chars} caracteres.` : "Mínimo alcanzado";

    maxCounter.textContent =
      `Disponibles: ${1000 - chars}`;

    wordCounter.textContent =
      wordCount >= 4 ? `Palabras: ${wordCount} OK` : `Palabras: ${wordCount}/4`;
  }

  function setError(input, id, msg) {
    const group = input.closest(".form-group");
    group.classList.remove("has-success");
    group.classList.add("has-error");

    const feedback = document.getElementById(id);
    feedback.textContent = msg;
    feedback.classList.add("error");
    feedback.classList.remove("success");
  }

  function setSuccess(input, id, msg) {
    const group = input.closest(".form-group");
    group.classList.remove("has-error");
    group.classList.add("has-success");

    const feedback = document.getElementById(id);
    feedback.textContent = msg;
    feedback.classList.add("success");
    feedback.classList.remove("error");
  }

  updateCounters();
}