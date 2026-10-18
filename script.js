// Interacciones sencillas de la página WikiDesign
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const topnav = document.querySelector(".topnav");

menuToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  topnav.classList.toggle("open");
});

document.getElementById("checkButton")?.addEventListener("click", () => {
  const checklist = document.getElementById("checklist");
  checklist.hidden = !checklist.hidden;
  document.getElementById("checkButton").textContent =
    checklist.hidden ? "Ver lista de comprobación" : "Ocultar lista de comprobación";
});

document.getElementById("searchForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.trim().toLocaleLowerCase("es");
  document.querySelectorAll(".search-highlight").forEach((el) => el.classList.remove("search-highlight"));
  if (!query) return;
  const sections = [...document.querySelectorAll(".searchable")];
  const match = sections.find((section) => section.innerText.toLocaleLowerCase("es").includes(query));
  if (match) {
    match.classList.add("search-highlight");
    match.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    alert("No encontramos esa palabra en esta página. Prueba con: usuario, solución, proceso o usabilidad.");
  }
});

// ===== Etapa 5: navegación interna =====

// Cerrar el menú móvil al elegir un enlace
document.querySelectorAll(".topnav a, .sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      sidebar?.classList.remove("open");
      topnav?.classList.remove("open");
    }
  });
});

// Botón flotante "volver arriba"
const toTop = document.getElementById("toTop");
const toggleToTop = () => { if (toTop) toTop.hidden = window.scrollY < 500; };
window.addEventListener("scroll", toggleToTop, { passive: true });
toggleToTop();

// Resaltar en el menú lateral la sección que se está leyendo
const sectionMap = { problema: "#problema", solucion: "#solucion", dcu: "#dcu", principios: "#principios", prueba: "#prueba" };
const sideLinks = [...document.querySelectorAll(".sidebar .side-link, .sidebar .summary a")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = "#" + entry.target.id;
      sideLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  Object.keys(sectionMap).forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// Visor ampliado de recursos multimedia (con anterior / siguiente)
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
const gallery = [...document.querySelectorAll("img[data-zoom]")];
let current = 0;
let lastFocus = null;

function showImage(index) {
  current = (index + gallery.length) % gallery.length;
  const img = gallery[current];
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = `${img.dataset.title} (${current + 1} de ${gallery.length})`;
}
function openLightbox(index) {
  lastFocus = document.activeElement;
  showImage(index);
  lightbox.hidden = false;
  document.body.classList.add("lb-open");
  document.getElementById("lbClose").focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("lb-open");
  lastFocus?.focus();
}
document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => openLightbox(Number(btn.dataset.open)));
});
gallery.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));
document.getElementById("lbClose")?.addEventListener("click", closeLightbox);
document.getElementById("lbPrev")?.addEventListener("click", () => showImage(current - 1));
document.getElementById("lbNext")?.addEventListener("click", () => showImage(current + 1));
lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showImage(current - 1);
  if (e.key === "ArrowRight") showImage(current + 1);
});
