document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-scroll");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML =
    '<div class="image-modal-card"><img alt="" /><button class="image-modal-close" type="button">Close</button></div>';
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");
  const modalClose = modal.querySelector(".image-modal-close");

  const openModal = (img) => {
    modalImg.src = img.src;
    modalImg.alt = img.alt || "Project image";
    modal.classList.add("open");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modalImg.src = "";
    modalImg.alt = "";
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  modalClose.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  document.querySelectorAll(".project-media img").forEach((img) => {
    img.classList.add("zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    const label = img.alt ? `Zoom image: ${img.alt}` : "Zoom image";
    img.setAttribute("aria-label", label);
    img.addEventListener("click", () => openModal(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(img);
      }
    });
  });
});
