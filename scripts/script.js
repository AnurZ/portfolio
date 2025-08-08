document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".icon-item img");
  const overlay = document.getElementById("window-overlay");
  const closeBtn = document.getElementById("close-window");
  const minimizeBtn = document.getElementById("minimize-window");
  const maximizeBtn = document.getElementById("maximize-window");
  const titleEl = document.getElementById("window-title");
  const contentEl = document.getElementById("window-content");
  const taskbar = document.getElementById("taskbar");

  const windowContentMap = {
    "Relevant Experience": `
    <div class="ul-exp" style="margin-bottom:5px;">
  <h3>FullStackStore - E-commerce Web Application</h3>
  <a href="https://fullstackstore-anur.azurewebsites.net/" target="_blank" rel="noopener noreferrer">Live Demo</a>
  <p>A modern full-stack online store built with Angular and ASP.NET Core Web API.</p>
  </div>
  <div class="img-div" style="background-color: rgba(188, 108, 220, 1);padding: 5px; margin-bottom: 10px;">
  <img src="images/fullstackstore-screenshot.png" alt="FullStackStore Screenshot" style="max-width: 85%; display: block; margin: 10px auto; border: 1px solid #ccc; border-radius: 4px;" />
    </div>
  
  <div class="ul-exp">
  <strong><a style="margin-left:10px;">Highlights:</a></strong>
  <ul>
    <li>Developed a full-featured e-commerce platform from scratch</li>
    <li>Implemented authentication, product management, and Stripe payment integration</li>
    <li>Designed a responsive Angular UI with admin tools and data binding</li>
    <li>Built RESTful APIs with ASP.NET Core and secured them with JWT</li>
  </ul>
    </div>
  <div class="ul-exp">
  <strong>Technologies:</strong>
  <ul>
    <li><em>Frontend:</em> Angular, TypeScript, Angular Material</li>
    <li><em>Backend:</em> ASP.NET Core Web API, Entity Framework Core</li>
    <li><em>Tools:</em> Git, Postman, Swagger, SQLite</li>
  </ul>
  </div>
`,
    Github: `<a href="https://github.com/AnurZ" target="_blank">https://github.com/AnurZ</a>`,
    Education: `<p>Bachelor's in Computer Science<br>FIT Mostar</p>`,
    Email: `<p>Contact me at:<br><code>anuranci@gmail.com</code></p>`,
    Skills: `
<h3>Technical Skills</h3>
<strong>Frontend</strong>



<ul>
  <li>Angular 18+, TypeScript</li>
  <li>HTML5, CSS3, Responsive Design</li>
  <li>Angular Material, RxJS, Reactive Forms</li>
</ul>

<strong>Backend</strong>
<ul>
  <li>ASP.NET Core Web API (.NET 6+)</li>
  <li>Entity Framework Core, LINQ</li>
  <li>JWT Authentication, Repository Pattern</li>
</ul>

<strong>Dev Tools</strong>
<ul>
  <li>Visual Studio, VS Code, Git & GitHub</li>
  <li>Postman, Swagger (OpenAPI)</li>
</ul>

<strong>Database</strong>
<ul>
  <li>SQLite (dev), SQL basics</li>
</ul>

<strong>Other</strong>
<ul>
  <li>REST APIs, MVC pattern</li>
  <li>Agile-friendly workflows</li>
</ul>
`,
    CV: `<div>
  <p>
    <a href="cv/Anur Zjakic SDE.pdf" download>
      📄 Download my CV (PDF)
    </a>
  </p>
</div>
`,
  };

  let isMaximized = false;
  let currentTaskbarButton = null; // Track the current taskbar button

  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const alt = icon.alt.trim();
      const content = windowContentMap[alt];

      if (content) {
        titleEl.textContent = alt;
        contentEl.innerHTML = content;
        overlay.classList.remove("hidden");

        if (!currentTaskbarButton) {
          // Create new taskbar button
          currentTaskbarButton = document.createElement("button");
          currentTaskbarButton.classList.add("taskbar-button");

          currentTaskbarButton.addEventListener("click", () => {
            overlay.classList.toggle("hidden");
          });

          taskbar.appendChild(currentTaskbarButton);
        }

        // Update button text to current window title
        currentTaskbarButton.textContent = alt;
      } else {
        console.warn("No content found for:", alt);
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    // Remove taskbar button if it exists
    if (currentTaskbarButton) {
      currentTaskbarButton.remove();
      currentTaskbarButton = null;
    }
  });

  minimizeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  maximizeBtn.addEventListener("click", () => {
    if (!isMaximized) {
      overlay.classList.add("maximized");
      overlay.style.left = "auto";
      overlay.style.right = "0";
      overlay.style.top = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "calc(100vh - 3%)";
      overlay.style.transform = "none";

      isMaximized = true;
    } else {
      overlay.classList.remove("maximized");
      overlay.style.width = "400px";
      overlay.style.height = "auto";
      overlay.style.top = "50%";
      overlay.style.left = "50%";
      overlay.style.right = "auto";
      overlay.style.transform = "translate(-50%, -50%)";

      isMaximized = false;
    }
  });

  // Dragging logic unchanged...
  const headerEl = overlay.querySelector(".window-header");
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  headerEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = overlay.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    overlay.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    overlay.style.left = `${e.clientX - offsetX}px`;
    overlay.style.top = `${e.clientY - offsetY}px`;
    overlay.style.transform = "none";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});
