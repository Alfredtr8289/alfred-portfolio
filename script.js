document.documentElement.classList.add("js");

var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var progressBar = document.getElementById("scroll-progress");
var heroArt = document.querySelector(".hero-art");
var scrollQueued = false;

function updateScrollProgress() {
  var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  var percent = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
  progressBar.style.width = Math.min(100, Math.max(0, percent)) + "%";
  if (heroArt && !reducedMotion) {
    var drift = Math.min(24, window.scrollY * 0.035);
    heroArt.style.setProperty("--scroll-drift", (-drift).toFixed(1) + "px");
  }
  scrollQueued = false;
}

window.addEventListener("scroll", function () {
  if (!scrollQueued) {
    window.requestAnimationFrame(updateScrollProgress);
    scrollQueued = true;
  }
}, { passive: true });
updateScrollProgress();

var revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: "0px 0px -28px 0px" });
  revealItems.forEach(function (item) { revealObserver.observe(item); });
} else {
  revealItems.forEach(function (item) { item.classList.add("in-view"); });
}

var roleWord = document.getElementById("role-word");
var roles = ["frontend development", "Python & Django", "AI engineering", "thoughtful web apps"];
var roleIndex = 0;
if (roleWord && !reducedMotion) {
  window.setInterval(function () {
    roleWord.classList.add("role-changing");
    window.setTimeout(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      roleWord.textContent = roles[roleIndex];
      roleWord.classList.remove("role-changing");
    }, 180);
  }, 2600);
}

var menuToggle = document.querySelector(".menu-toggle");
var primaryNav = document.getElementById("primary-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}
menuToggle.addEventListener("click", function () {
  var open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  primaryNav.classList.toggle("is-open", open);
});
primaryNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", closeMenu);
});
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".tilt-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      var rotateY = (x - 0.5) * 2.4;
      var rotateX = (0.5 - y) * 1.8;
      card.style.transform = "perspective(1100px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
    });
    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  });
}

var year = document.getElementById("current-year");
if (year) year.textContent = String(new Date().getFullYear());
