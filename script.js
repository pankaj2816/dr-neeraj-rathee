const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const appointmentForm = document.querySelector("[data-appointment-form]");

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

if (appointmentForm) {
  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = appointmentForm.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.textContent : "";

    const formData = new FormData(appointmentForm);
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
