document.addEventListener("DOMContentLoaded", () => {
  const essayContainer = document.getElementById("essayContainer");
  const panelContent = document.getElementById("panelContent");
  const floatingPanel = document.getElementById("floatingPanel");
  const sleepBtn = document.getElementById("sleepBtn");
  const displayMode = document.getElementById("displayMode");
  let currentOpenDropdown = null;

  // Fetch JSON data
  fetch("phrases.json")
    .then(response => response.json())
    .then(data => buildEssay(data))
    .catch(err => console.error("Error loading phrases.json:", err));

  function buildEssay(data) {
    Object.keys(data).forEach(sectionKey => {
      const section = data[sectionKey];
      const paragraph = document.createElement("div");
      paragraph.classList.add("paragraph");
      paragraph.id = sectionKey;

      const header = document.createElement("div");
      header.classList.add("paragraph-header");

      // Create dropdown buttons dynamically
      Object.keys(section).forEach(category => {
        const btn = document.createElement("button");
        btn.classList.add("icon-btn");
        btn.innerText = "💡";
        btn.title = category.charAt(0).toUpperCase() + category.slice(1);
        btn.dataset.dropdown = `${sectionKey}-${category}`;
        header.appendChild(btn);

        const dropdownDiv = document.createElement("div");
        dropdownDiv.classList.add("dropdown-container");
        dropdownDiv.id = `${sectionKey}-${category}`;

        const select = document.createElement("select");
        section[category].forEach(opt => {
          const option = document.createElement("option");
          option.textContent = opt;
          select.appendChild(option);
        });
        dropdownDiv.appendChild(select);
        paragraph.appendChild(dropdownDiv);
      });

      const textarea = document.createElement("textarea");
      textarea.placeholder = "Write your ideas here...";
      paragraph.appendChild(header);
      paragraph.appendChild(textarea);
      essayContainer.appendChild(paragraph);
    });

    setupInteractions();
  }

  function setupInteractions() {
    const iconButtons = document.querySelectorAll(".icon-btn");
    const dropdowns = document.querySelectorAll(".dropdown-container");

    iconButtons.forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = btn.dataset.dropdown;
        const dropdown = document.getElementById(id);

        // Close previous dropdown if another is opened
        if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
          closeDropdown(currentOpenDropdown);
        }

        if (dropdown.classList.contains("show")) {
          closeDropdown(dropdown);
          currentOpenDropdown = null;
        } else {
          openDropdown(dropdown);
          currentOpenDropdown = dropdown;
        }
      });
    });

    // Prevent closing when clicking inside dropdown
    dropdowns.forEach(d => {
      d.addEventListener("click", e => e.stopPropagation());
    });

    // Close dropdown on outside click or ESC
    document.addEventListener("click", () => {
      if (currentOpenDropdown) closeDropdown(currentOpenDropdown);
      currentOpenDropdown = null;
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && currentOpenDropdown) {
        closeDropdown(currentOpenDropdown);
        currentOpenDropdown = null;
      }
    });

    // Sync textarea to floating panel
    document.querySelectorAll("textarea").forEach(t => {
      t.addEventListener("input", updatePanel);
    });

    // Floating panel sleep toggle
    sleepBtn.addEventListener("click", () => floatingPanel.classList.toggle("sleep"));

    // Display mode toggle (per paragraph/full page)
    displayMode.addEventListener("change", () => {
      document.getElementById("essayContainer").classList.toggle("per-paragraph");
    });
  }

  function openDropdown(dropdown) {
    dropdown.style.display = "block";
    dropdown.classList.add("show");
    dropdown.animate([
      { opacity: 0, transform: "translateY(-10px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 250, fill: "forwards", easing: "ease-out" });
  }

  function closeDropdown(dropdown) {
    const anim = dropdown.animate([
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-10px)" }
    ], { duration: 200, fill: "forwards", easing: "ease-in" });
    anim.onfinish = () => dropdown.style.display = "none";
    dropdown.classList.remove("show");
  }

  function updatePanel() {
    const content = Array.from(document.querySelectorAll("textarea"))
      .map(t => t.value.trim())
      .filter(v => v)
      .join("\n\n");
    panelContent.textContent = content;
  }
});
