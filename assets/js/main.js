
// Hero Section
// Loader
window.addEventListener("load", () => {
    document.querySelector(".loader").style.display = "none";
  });
  
  // Mobile Menu
  function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.style.transform =
      menu.style.transform === "translateY(0%)"
        ? "translateY(-100%)"
        : "translateY(0%)";
  }
// header (navbar)
let prevScrollPos = window.pageYOffset;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const currentScrollPos = window.pageYOffset;

  // Show navbar on scroll up
  if (prevScrollPos > currentScrollPos) {
    navbar.style.top = "0";

    // Add background ONLY when not at top
    if (currentScrollPos > 50) {
      navbar.classList.add("nav-scrolled");
    } else {
      navbar.classList.remove("nav-scrolled");
    }

  } else {
    // Hide navbar on scroll down
    navbar.style.top = "-120px";
    navbar.classList.remove("nav-scrolled");
  }

  prevScrollPos = currentScrollPos;
});

// lets talk 
function toggleTalk() {
    document.getElementById("talkPanel").classList.toggle("active");
  }
  
//let talk form
function validateForm() {
    const fields = document.querySelectorAll(".field");
    const formError = document.querySelector(".form-error");
    let valid = true;
  
    fields.forEach(field => {
      const input = field.querySelector("input");
  
      if (!input.value.trim()) {
        field.classList.add("error");
        valid = false;
      } else {
        field.classList.remove("error");
      }
    });
  
    if (!valid) {
      formError.style.display = "block";
    } else {
      formError.style.display = "none";
      // SUCCESS – go to next step / submit
      console.log("Form valid");
    }
  }
  

  // project section
gsap.registerPlugin(ScrollTrigger);

/* PROJECT TITLE SCROLL */
gsap.to(".projects-title", {
  x: "-95vw",
  color: "#c7a17a",
  ease: "none",
  scrollTrigger: {
    trigger: ".projects",
    start: "top center",
    end: "top top",
    scrub: true
  }
});

// PROJECT IMAGE MODAL
const modal = document.getElementById("imageModal");
const modalImg = modal.querySelector(".modal-img");
const closeBtn = modal.querySelector(".modal-close");

document.querySelectorAll(".project-open").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const img = btn.parentElement.querySelector("img");
    modalImg.src = img.src;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


// Process
const slider = document.querySelector(".img-wrapper");
const beforeImg = document.querySelector(".before-img");
const sliderLine = document.querySelector(".slider-line");
const sliderHandle = document.querySelector(".slider-handle");

let isDragging = false;

/* =========================
   DRAG STATE
========================= */
function startDrag() {
  isDragging = true;
  slider.classList.add("is-dragging");
}

function stopDrag() {
  isDragging = false;
  slider.classList.remove("is-dragging");
}

slider.addEventListener("mousedown", startDrag);
window.addEventListener("mouseup", stopDrag);

slider.addEventListener("touchstart", startDrag);
window.addEventListener("touchend", stopDrag);

/* =========================
   SLIDER UPDATE (CORE)
========================= */
function updateSlider(percentage) {
  // Clamp
  percentage = Math.max(0, Math.min(100, percentage));

  // Move visuals
  beforeImg.style.width = percentage + "%";
  sliderLine.style.left = percentage + "%";
  sliderHandle.style.left = percentage + "%";

  // LABEL LOGIC
  if (percentage > 45) {
    slider.classList.add("show-before");
    slider.classList.remove("show-after");
  } else if (percentage < 55) {
    slider.classList.add("show-after");
    slider.classList.remove("show-before");
  } else {
    slider.classList.remove("show-before", "show-after");
  }
}

/* =========================
   MOUSE MOVE
========================= */
slider.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = slider.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percentage = (offsetX / rect.width) * 100;

  updateSlider(percentage);
});

slider.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const rect = slider.getBoundingClientRect();
  const offsetX = e.touches[0].clientX - rect.left;
  const percentage = (offsetX / rect.width) * 100;

  updateSlider(percentage);
});


// Press, Award, Publication
const papSlider = document.querySelector(".pap-slider");
let papCards = Array.from(document.querySelectorAll(".pap-card"));
const papPrev = document.querySelector(".pap-nav.prev");
const papNext = document.querySelector(".pap-nav.next");

let papIndex;
let autoScrollInterval;

/* Cards per view */
function getCardsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 991) return 2;
  return 3;
}

/* ===== CLONE BUFFER ===== */
function setupInfiniteLoop() {
  const perView = getCardsPerView();

  // Clone last cards to start
  papCards.slice(-perView).forEach(card => {
    papSlider.insertBefore(card.cloneNode(true), papSlider.firstChild);
  });

  // Clone first cards to end
  papCards.slice(0, perView).forEach(card => {
    papSlider.appendChild(card.cloneNode(true));
  });

  // Refresh card list
  papCards = Array.from(document.querySelectorAll(".pap-card"));

  // Start index in real cards
  papIndex = perView;
}

/* ===== UPDATE SLIDER ===== */
function updatePapSlider(animate = true) {
  const wrapper = document.querySelector(".pap-slider-wrapper");
  const perView = getCardsPerView();

  papCards.forEach(card => card.classList.remove("active"));

  const centerOffset = Math.floor(perView / 2);
  const activeIndex = papIndex + centerOffset;
  const activeCard = papCards[activeIndex];

  activeCard.classList.add("active");

  const wrapperCenter = wrapper.offsetWidth / 2;
  const sliderRect = papSlider.getBoundingClientRect();
  const cardRect = activeCard.getBoundingClientRect();

  const cardCenter =
    cardRect.left - sliderRect.left + cardRect.width / 2;

  papSlider.style.transition = animate
    ? "transform 0.6s ease"
    : "none";

  papSlider.style.transform = `translateX(${wrapperCenter - cardCenter}px)`;
}

/* ===== RESET POSITION (INVISIBLE) ===== */
function resetIfNeeded() {
  const perView = getCardsPerView();
  const total = papCards.length;

  if (papIndex >= total - perView) {
    papIndex = perView;
    updatePapSlider(false);
  }

  if (papIndex < perView) {
    papIndex = total - perView * 2;
    updatePapSlider(false);
  }
}

/* ===== NAVIGATION ===== */
papNext.addEventListener("click", () => {
  papIndex++;
  updatePapSlider();
  setTimeout(resetIfNeeded, 650);
});

papPrev.addEventListener("click", () => {
  papIndex--;
  updatePapSlider();
  setTimeout(resetIfNeeded, 650);
});

/* ===== AUTO SCROLL ===== */
function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    papNext.click();
  }, 3000);
}

function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

papSlider.addEventListener("mouseenter", stopAutoScroll);
papSlider.addEventListener("mouseleave", startAutoScroll);

window.addEventListener("resize", () => {
  papSlider.innerHTML = "";
  papCards = Array.from(document.querySelectorAll(".pap-card"));
  setupInfiniteLoop();
  updatePapSlider(false);
});

/* ===== INIT ===== */
setupInfiniteLoop();
updatePapSlider(false);
startAutoScroll();
