const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const whatsappForm = document.getElementById("whatsapp-form");
const emailForm = document.getElementById("email-form");
const formTabs = document.querySelectorAll("[data-tab]");

// 1. Mobile Menu Toggling
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");

      // Smooth scroll without adding # to URL
      const hash = link.getAttribute("href");
      if (hash && hash.startsWith("#") && hash.length > 1) {
        event.preventDefault();
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  });
}

// 2. Appointment Form Tab Toggling
formTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    formTabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const targetForm = tab.getAttribute("data-tab");
    if (targetForm === "whatsapp") {
      whatsappForm.style.display = "grid";
      emailForm.style.display = "none";
    } else {
      whatsappForm.style.display = "none";
      emailForm.style.display = "grid";
    }
  });
});

// 3. WhatsApp Form Submit Action
if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = whatsappForm.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.textContent : "";

    const formData = new FormData(whatsappForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const visit = String(formData.get("visit") || "").trim();
    const reason = String(formData.get("reason") || "").trim();

    if (submitBtn) {
      submitBtn.textContent = "Opening WhatsApp...";
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }

    const isHindi = document.documentElement.lang === "hi";
    const msgBase = isHindi ? "नमस्ते, मैं डॉ. नीरज कुमार राठी के साथ अपॉइंटमेंट लेना चाहता/चाहती हूँ।" : "Hello, I would like to request an appointment with Dr. Neeraj Kumar Rathee.";
    
    const message = [
      msgBase,
      name ? (isHindi ? `मरीज का नाम: ${name}` : `Patient name: ${name}`) : "",
      phone ? (isHindi ? `संपर्क नंबर: ${phone}` : `Contact number: ${phone}`) : "",
      visit ? (isHindi ? `पसंदीदा यात्रा का समय: ${visit}` : `Preferred visit time: ${visit}`) : "",
      reason ? (isHindi ? `कारण: ${reason}` : `Reason: ${reason}`) : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/919251117259?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

// 4. Email Form Submit Feedback Handler
if (emailForm) {
  emailForm.addEventListener("submit", () => {
    const submitBtn = emailForm.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.textContent = "Sending Email...";
      submitBtn.disabled = true;
    }
  });
}

// 5. Back to Top Button Actions
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// 6. Intersection Observer for Scroll Reveals (Animations)
const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// 7. Stats Counter Animation Logic
const statNumbers = document.querySelectorAll(".stat-number");
if (statNumbers.length > 0) {
  let statsAnimated = false;

  const countUp = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute("data-target"), 10);
      const duration = 1500; // 1.5 seconds animation
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out function
        const easeOutQuad = (t) => t * (2 - t);
        const currentCount = Math.floor(easeOutQuad(progress) * target);

        stat.textContent = currentCount.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.querySelector(".stats-bar");
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          countUp();
          statsAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statsObserver.observe(statsSection);
  }
}

// 8. Active Nav Link Highlighting on Scroll
const sections = document.querySelectorAll("section[id]");
const navAnchorLinks = document.querySelectorAll("[data-nav-links] a");

if (sections.length > 0 && navAnchorLinks.length > 0) {
  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navAnchorLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-20% 0px -60% 0px" // Triggers when section occupies central screen area
  });

  sections.forEach(sec => activeNavObserver.observe(sec));
}

// 9. Interactive Suitability Checker Tabs
const suitabilityButtons = document.querySelectorAll(".suitability-btn");
const suitabilityPanels = document.querySelectorAll(".suitability-panel");

if (suitabilityButtons.length > 0 && suitabilityPanels.length > 0) {
  suitabilityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      suitabilityButtons.forEach(b => b.classList.remove("active"));
      suitabilityPanels.forEach(p => {
        p.style.display = "none";
        p.classList.remove("active");
      });

      btn.classList.add("active");
      const targetSite = btn.getAttribute("data-site");
      const targetPanel = document.getElementById(`suitability-${targetSite}`);
      if (targetPanel) {
        targetPanel.style.display = "block";
        targetPanel.classList.add("active");
      }
    });
  });
}

// 10. Floating Action Button (FAB) Toggle
const fabToggle = document.getElementById("fabToggle");
const fabMenu = document.getElementById("fabMenu");

if (fabToggle && fabMenu) {
  fabToggle.addEventListener("click", () => {
    fabToggle.classList.toggle("open");
    fabMenu.classList.toggle("open");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!fabToggle.contains(e.target) && !fabMenu.contains(e.target)) {
      fabToggle.classList.remove("open");
      fabMenu.classList.remove("open");
    }
  });
}

// 11. Clinical Hub Tab Switching
const hubTabs = document.querySelectorAll(".hub-main-tab");
const hubPanels = document.querySelectorAll(".hub-panel");

if (hubTabs.length > 0 && hubPanels.length > 0) {
  hubTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active from all tabs & panels
      hubTabs.forEach(t => t.classList.remove("active"));
      hubPanels.forEach(p => {
        p.style.display = "none";
        p.classList.remove("active");
      });

      // Set active
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);
      
      if (targetPanel) {
        targetPanel.style.display = "block";
        // Small delay to allow display:block to apply before adding class for animation
        setTimeout(() => targetPanel.classList.add("active"), 10);
      }
    });
  });
}

// 12. Swiper Carousel Initialization
if (typeof Swiper !== 'undefined') {
  // Studies and Experience Swiper
  new Swiper('.credential-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: '.credential-next',
      prevEl: '.credential-prev',
    },
    pagination: {
      el: '.credential-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 4,
      }
    }
  });

  // Testimonials Swiper
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    navigation: {
      nextEl: '.testimonials-next',
      prevEl: '.testimonials-prev',
    },
    pagination: {
      el: '.testimonials-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      }
    }
  });
}

// 13. Modal Toggle Logic
const modalBtns = document.querySelectorAll('.open-modal-btn');
const appointmentModal = document.getElementById('appointmentModal');
const closeModalBtn = document.getElementById('closeModal');

if (appointmentModal) {
  const openModal = (e) => {
    e.preventDefault();
    appointmentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    appointmentModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close on outside click
  appointmentModal.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
      closeModal();
    }
  });
}

// 14. ScrollReveal Initialization
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    distance: '30px',
    duration: 800,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    reset: false
  });

  sr.reveal('.hero-intro, .hero-badges', { origin: 'bottom', interval: 100, delay: 200 });
  sr.reveal('.section-heading', { origin: 'bottom', delay: 100 });
  sr.reveal('.hub-tabs-nav', { origin: 'bottom', delay: 200 });
  sr.reveal('.testimonial-card', { origin: 'bottom', interval: 150 });
  sr.reveal('.faq-list details', { origin: 'bottom', interval: 100 });
}
