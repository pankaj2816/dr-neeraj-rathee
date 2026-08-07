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
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
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

    const message = [
      "Hello, I would like to request an appointment with Dr. Neeraj Rathee.",
      name ? `Patient name: ${name}` : "",
      phone ? `Contact number: ${phone}` : "",
      visit ? `Preferred visit time: ${visit}` : "",
      reason ? `Reason: ${reason}` : "",
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
