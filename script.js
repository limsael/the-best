const body = document.body;
const letter = document.querySelector("#letter");
const openButton = document.querySelector(".letter-button");
const scrollCue = document.querySelector(".scroll-cue");
const progressLine = document.querySelector(".reading-progress__line");
const progressLabel = document.querySelector(".reading-progress__label");
const heroWash = document.querySelector(".hero__wash");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let isOpen = false;
let ticking = false;

function openLetter() {
  if (!isOpen) {
    isOpen = true;
    body.classList.remove("letter-closed");
    body.classList.add("letter-open");
    letter.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
  }

  if (window.location.hash === "#opening") {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  window.setTimeout(
    () => letter.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" }),
    prefersReducedMotion.matches ? 0 : 560,
  );
}

openButton.addEventListener("click", openLetter);
scrollCue.addEventListener("click", openLetter);

document.querySelector(".skip-link").addEventListener("click", () => {
  if (!isOpen) {
    isOpen = true;
    body.classList.remove("letter-closed");
    body.classList.add("letter-open");
    letter.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
  }
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const chapterStops = [
  { element: document.querySelector("#the-wish"), label: "The wish" },
  { element: document.querySelector("#the-unsaid"), label: "The unsaid" },
  { element: document.querySelector("#whatever-comes-next"), label: "Whatever comes next" },
  { element: document.querySelector("#closing"), label: "With care, always" },
];

function updateScrollDetails() {
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - viewportHeight;
  const progress = documentHeight > 0 ? Math.min(Math.max(window.scrollY / documentHeight, 0), 1) : 0;
  progressLine.style.transform = `scaleY(${progress})`;

  if (!prefersReducedMotion.matches) {
    heroWash.style.setProperty("--parallax-y", `${Math.min(window.scrollY * 0.12, 90)}px`);
  }

  const marker = window.scrollY + viewportHeight * 0.48;
  let currentLabel = "A quiet beginning";
  chapterStops.forEach((stop) => {
    if (stop.element.offsetTop <= marker) currentLabel = stop.label;
  });
  progressLabel.textContent = currentLabel;
  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(updateScrollDetails);
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollDetails();
