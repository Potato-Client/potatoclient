(() => {
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  root.dataset.theme = localStorage.getItem("potato-theme") || "green";

  const modGrid = $(".mod-grid");

  if (modGrid) {
    try {
      $(".mod-card", modGrid)
        .sort((a, b) => {
          const nameA = $(".mod-name", a)?.textContent || "";
          const nameB = $(".mod-name", b)?.textContent || "";

          return nameA.trim().localeCompare(nameB.trim(), undefined, {
            sensitivity: "base",
            numeric: true,
          });
        })
        .forEach((card) => modGrid.appendChild(card));
    } catch (error) {
      // Keep the original order if sorting cannot be completed.
    }
  }

  function open(modal) {
    if (!modal) return;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => $(".close", modal)?.focus(), 50);
  }

  function close(modal) {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (!$(".modal.open")) {
      document.body.style.overflow = "";
    }
  }

  $$(".js-open").forEach((button) => {
    button.addEventListener("click", () => {
      open($("#" + button.dataset.modal));
    });
  });

  $$(".modal").forEach((modal) => {
    $$(".close", modal).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        close(modal);
      });
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        close(modal);
      }
    });
  });

  $$(".theme-option").forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.theme = button.dataset.theme;
      localStorage.setItem("potato-theme", button.dataset.theme);
      close($("#themeModal"));

      const toast = $("#toast");

      if (toast) {
        toast.textContent = button.dataset.theme + " theme applied";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1400);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const modal = $(".modal.open");

      if (modal) {
        close(modal);
      }
    }
  });

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");

  $$(".preview-card").forEach((card) => {
    card.tabIndex = 0;

    const openPreview = () => {
      const image = $("img", card);

      if (!lightbox || !image) return;

      lightboxImage.src = image.getAttribute("src");
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent =
        $("figcaption", card)?.textContent || "Preview";

      open(lightbox);
    };

    card.addEventListener("click", openPreview);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview();
      }
    });
  });
})();
