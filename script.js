document.addEventListener("DOMContentLoaded", () => {
  const essayContainer = document.getElementById("essayContainer");
  const panelContent = document.getElementById("panelContent");
  const floatingPanel = document.getElementById("floatingPanel");
  const sleepBtn = document.getElementById("sleepBtn");
  const displayMode = document.getElementById("displayMode");

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

      // Create buttons dynamically
      Object.keys(section).forEach(category => {
        const btn = document.createElement("button");
        btn.classList.add("icon-btn");
        btn.innerText = "💡";
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
      textarea.placeholder = "Write here...";
      paragraph.appendChild(header);
      paragraph.appendChild(textarea);
      essayContainer.appendChild(paragraph);
    });

    setupInteractions();
  }

  function setupInteractions() {
    document.querySelectorAll(".icon-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.dropdown;
        const dropdown = document.getElementById(id);
        document.querySelectorAll(".dropdown-container").forEach(dc => dc.classList.remove("show"));
        dropdown.classList.toggle("show");
      });
    });

    document.querySelectorAll("textarea").forEach(t => {
      t.addEventListener("input", updatePanel);
    });

    sleepBtn.addEventListener("click", () => floatingPanel.classList.toggle("sleep"));
    displayMode.addEventListener("change", () => {
      document.getElementById("essayContainer").classList.toggle("per-paragraph");
    });
  }

  function updatePanel() {
    const content = Array.from(document.querySelectorAll("textarea")).map(t => t.value).join("\n\n");
    panelContent.textContent = content;
  }
});
