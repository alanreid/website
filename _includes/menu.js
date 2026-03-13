const nav = document.getElementById("nav");
const hero = document.getElementById("hero");

const onScroll = () => {
  const heroBottom = hero.offsetTop + hero.offsetHeight - 100;
  nav.classList.toggle("scrolled", window.scrollY > heroBottom);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navOverlay = document.getElementById("navOverlay");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  navToggle.classList.toggle("active");
  navOverlay.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

function closeNav() {
  navToggle.classList.remove("active");
  navLinks.classList.remove("open");
  navOverlay.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

navOverlay.addEventListener("click", closeNav);

const heroCta = document.getElementById("heroCta");
const fixedCta = document.getElementById("fixedCta");
const contactSection = document.getElementById("contact");

var heroCtaVisible = true;
var contactVisible = false;

function updateFixedCta() {
  fixedCta.classList.toggle("visible", !heroCtaVisible && !contactVisible);
}

var ctaObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.target === heroCta) {
      heroCtaVisible = entry.isIntersecting;
    }

    if (entry.target === contactSection) {
      contactVisible = entry.isIntersecting;
    }

    updateFixedCta();
  });
});

ctaObserver.observe(heroCta);
ctaObserver.observe(contactSection);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        navAnchors.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${id}`),
        );
      }
    });
  },
  { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
);

sections.forEach((s) => sectionObserver.observe(s));
