(function () {
  "use strict";
  async function loadComponent(id, path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Gagal memuat " + path);
      document.getElementById(id).innerHTML = await response.text();
    } catch (error) {
      console.error("Error loading component:", error);
    }
  }
  function showNotification(message, type = "success") {
    document.querySelector(".notification-popup")?.remove();
    const el = document.createElement("div");
    el.className = `notification-popup notification-${type}`;
    el.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i><span>${message}</span><button class="notification-close" aria-label="Close">&times;</button>`;
    el.querySelector("button").onclick = () => el.remove();
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
  function init() {
    if (window.emailjs) {
      emailjs.init({ publicKey: "CZEcwpfh2faaFnunX" });
    } else {
      console.warn("EmailJS belum siap, form kirim pesan akan dinonaktifkan.");
    }

    const header = document.getElementById("header"),
      hamburger = document.querySelector(".hamburger"),
      menu = document.querySelector(".nav-menu");
    const links = document.querySelectorAll(".nav-link"),
      sections = document.querySelectorAll("section[id]");
    const closeMenu = () => {
      hamburger?.classList.remove("active");
      menu?.classList.remove("active");
      document.body.style.overflow = "";
    };
    hamburger?.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.style.overflow = menu.classList.contains("active")
        ? "hidden"
        : "";
    });
    links.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeMenu(),
    );
    const onScroll = () => {
      header?.classList.toggle("scrolled", scrollY > 40);
      let active = "";
      sections.forEach((section) => {
        if (scrollY + 150 >= section.offsetTop) active = section.id;
      });
      links.forEach((link) =>
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${active}`,
        ),
      );
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    document.querySelectorAll('a[href^="#"]').forEach((anchor) =>
      anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        scrollTo({
          top: target.offsetTop - (header?.offsetHeight || 0),
          behavior: "smooth",
        });
      }),
    );
    const reveal = document.querySelectorAll(
      ".edu-card,.org-card,.skills-card,.project-card,.timeline-item,.contact-item",
    );
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.1 },
      );
      reveal.forEach((el) => observer.observe(el));
    } else reveal.forEach((el) => el.classList.add("revealed"));
    document
      .querySelector("#contactForm")
      ?.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!window.emailjs) {
          showNotification(
            "Layanan email sedang tidak tersedia saat ini.",
            "error",
          );
          return;
        }

        const button = this.querySelector(".btn-submit"),
          original = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
        emailjs.sendForm("service_z8yom3a", "template_87ubxgh", this).then(
          () => {
            showNotification("Pesan berhasil dikirim langsung ke email!");
            this.reset();
            button.innerHTML = '<i class="fas fa-check"></i> Sent!';
            setTimeout(() => {
              button.innerHTML = original;
              button.disabled = false;
            }, 2500);
          },
          (error) => {
            console.error("EmailJS Error:", error);
            showNotification(
              "Gagal mengirim pesan, silakan coba lagi.",
              "error",
            );
            button.innerHTML = original;
            button.disabled = false;
          },
        );
      });
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.transform = `perspective(900px) rotateX(${((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -2}deg) rotateY(${((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 2}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
    const top = document.createElement("button");
    top.className = "back-to-top";
    top.innerHTML = '<i class="fas fa-chevron-up"></i>';
    top.setAttribute("aria-label", "Back to top");
    document.body.appendChild(top);
    addEventListener(
      "scroll",
      () => top.classList.toggle("show", scrollY > 500),
      { passive: true },
    );
    top.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
    const copy = document.querySelector(".footer-copy");
    if (copy)
      copy.textContent = copy.textContent.replace(
        /\d{4}/,
        new Date().getFullYear(),
      );
  }
  document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all(
      [
        ["header-component", "header.html"],
        ["hero-component", "hero.html"],
        ["about-component", "about.html"],
        ["education-component", "education.html"],
        ["experience-component", "experience.html"],
        ["organizations-component", "organizations.html"],
        ["skills-component", "skills.html"],
        ["projects-component", "projects.html"],
        ["contact-component", "contact.html"],
        ["footer-component", "footer.html"],
      ].map(([id, path]) => loadComponent(id, path)),
    );
    init();
    console.log(
      "%cこんにちは！%c Thanks for visiting! 🎌",
      "font-size:1.1em;font-weight:bold;color:#61e5dc",
      "color:#91a6b9",
    );
  });
})();
