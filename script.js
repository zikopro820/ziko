/* =========================================================
   ziko.pro — Script compartido por todas las páginas
   ⚠️ CAMBIA AQUÍ TUS DATOS (se aplican a todo el sitio)
   ========================================================= */
const WHATSAPP = "51999999999";        // código de país + número, sin + ni espacios
const EMAIL    = "contacto@ziko.pro";  // correo donde llegan los reclamos

/* ---------- Enlaces de WhatsApp ---------- */
const waMsg = "Hola ziko.pro, quiero información sobre una página web.";
document.querySelectorAll(".wa-link").forEach(a => {
  const txt = a.dataset.msg || waMsg;
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(txt);
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Menú móvil ---------- */
const menu = document.getElementById("menu");
const burger = document.getElementById("hamburger");
if (burger && menu) {
  burger.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
}

/* ---------- Año automático ---------- */
document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

/* ---------- Animación al hacer scroll ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

/* ---------- Formulario de contacto -> WhatsApp ---------- */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  // Si llegan desde "Elegir plan", se preselecciona el servicio
  const plan = new URLSearchParams(location.search).get("plan");
  if (plan) {
    const sel = document.getElementById("servicio");
    [...sel.options].forEach(o => { if (o.text.toLowerCase().includes(plan.toLowerCase())) sel.value = o.value; });
  }
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const texto =
      "Hola ziko.pro 👋\n" +
      "Nombre: " + v("nombre") + "\n" +
      "Negocio: " + v("negocio") + "\n" +
      "Teléfono: " + v("telefono") + "\n" +
      "Servicio: " + v("servicio") + "\n" +
      "Presupuesto: " + v("presupuesto") + "\n" +
      "Mensaje: " + v("mensaje");
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank");
  });
}

/* ---------- Filtros del portafolio ---------- */
const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach(btn => btn.addEventListener("click", () => {
  filterBtns.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.filter;
  document.querySelectorAll(".project[data-cat]").forEach(p => {
    p.classList.toggle("hide", f !== "todos" && p.dataset.cat !== f);
  });
}));

/* ---------- Libro de Reclamaciones -> correo ---------- */
const reclamoForm = document.getElementById("reclamoForm");
if (reclamoForm) {
  const d = new Date();
  const hoja = "ZK-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") +
               String(d.getDate()).padStart(2, "0") + "-" + String(d.getTime()).slice(-5);
  document.getElementById("hoja").textContent = hoja;
  document.getElementById("fecha").textContent = d.toLocaleDateString("es-PE");

  reclamoForm.addEventListener("submit", e => {
    e.preventDefault();
    const v = id => (document.getElementById(id).value || "").trim();
    const r = name => (document.querySelector('input[name="' + name + '"]:checked') || {}).value || "";
    const cuerpo =
      "HOJA DE RECLAMACIÓN N° " + hoja + "\nFecha: " + d.toLocaleDateString("es-PE") + "\n\n" +
      "1. CONSUMIDOR\nNombre: " + v("r_nombre") + "\nDocumento: " + v("r_doc") +
      "\nDomicilio: " + v("r_dir") + "\nTeléfono: " + v("r_tel") + "\nCorreo: " + v("r_email") +
      "\nMenor de edad: " + r("menor") + (v("r_apoderado") ? "\nPadre/Madre/Apoderado: " + v("r_apoderado") : "") + "\n\n" +
      "2. BIEN CONTRATADO\nTipo: " + r("bien") + "\nMonto: " + v("r_monto") + "\nDescripción: " + v("r_desc") + "\n\n" +
      "3. DETALLE\nTipo: " + r("tipo") + "\nDetalle: " + v("r_detalle") + "\nPedido: " + v("r_pedido");
    location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Libro de Reclamaciones - " + hoja) +
                    "&body=" + encodeURIComponent(cuerpo);
    document.getElementById("reclamoOk").style.display = "block";
  });
}
