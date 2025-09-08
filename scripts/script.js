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

<div class="project-card">
    <div class="project-header">
      <h3 class="project-title">GameShelf — Game Store Web App</h3>
      <div class="project-links">
        <a class="project-link" href="https://gameshelf-anur.azurewebsites.net/home" target="_blank" rel="noopener noreferrer">Live Demo</a>
        <a class="project-link" href="https://github.com/AnurZ/GameShelf" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
    <p style="font-size: 0.85em; color: gray; font-style: italic;">
    ⏳ First load may take ~10s (free Azure hosting)
    </p>
    <p>An online game store built with Angular frontend and ASP.NET Core backend, featuring authentication, browsing, and purchasing games.</p>

    <div class="project-media">
      <img src="images/gameshelf.PNG" alt="GameShelf Screenshot" />
    </div>

    <span class="section-label">Highlights</span>
    <ul class="bullets">
      <li>Browse, search, and purchase games</li>
      <li>Authentication with JWT tokens</li>
      <li>Admin panel for managing games</li>
      <li>Responsive UI built with Angular</li>
      <li>Backend APIs built with ASP.NET Core Web API</li>
    </ul>

    <span class="section-label">Tech</span>
    <div class="pill-row" aria-label="Technologies">
      <span class="pill">Angular</span>
      <span class="pill">TypeScript</span>
      <span class="pill">ASP.NET Core</span>
      <span class="pill">Entity Framework Core</span>
      <span class="pill">SQLite</span>
      <span class="pill">JWT</span>
      <span class="pill">Swagger</span>
      <span class="pill">Responsive Design</span>
    </div>

      <span class="section-label">Key Features</span>
    <ul class="bullets">
      <li>Buy Games</li>
      <li>Search,sort,filter games</li>
      <li>Register & login (JWT Authentication)</li>
      <li>Create new games (admin only)</li>
      <li>Pagination for listing</li>
    </ul>

  </div>

<div class="projects-grid">
  <!-- Project 1: FullStackStore -->
  <div class="project-card">
  
    <div class="project-header">
      <h3 class="project-title">FullStackStore — E-commerce Web App</h3>
      <div class="project-links">
        <a class="project-link" href="https://fullstackstore-anur.azurewebsites.net/" target="_blank " rel="noopener noreferrer">Live Demo</a>
        <a class="project-link" href="https://github.com/AnurZ/fullstackstore" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      
    </div>
    <p style="font-size: 0.85em; color: gray; font-style: italic;">
  ⏳ First load may take ~20s (free Azure hosting).
  </p>
    <p>A modern full-stack online store built with Angular and ASP.NET Core Web API.</p>

    <div class="project-media">
      <img src="images/fullstackstore-screenshot.png" alt="FullStackStore Screenshot" />
    </div>

    <span class="section-label">Highlights</span>
    <ul class="bullets">
      <li>Developed a full-featured e-commerce platform from scratch</li>
      <li>Authentication, product management, Stripe payment integration</li>
      <li>Responsive Angular UI with admin tools and data binding</li>
      <li>RESTful APIs secured with JWT</li>
    </ul>

    <span class="section-label">Tech</span>
    <div class="pill-row" aria-label="Technologies">
      <span class="pill">Angular</span>
      <span class="pill">TypeScript</span>
      <span class="pill">Angular Material</span>
      <span class="pill">ASP.NET Core</span>
      <span class="pill">EF Core</span>
      <span class="pill">SQLite</span>
      <span class="pill">Stripe</span>
      <span class="pill">Swagger</span>
    </div>
  </div>

  <!-- Project 2: RetroBlog -->
  <div class="project-card">
    <div class="project-header">
      <h3 class="project-title">RetroBlog — Blog Platform</h3>
      <div class="project-links">
        
        <a class="project-link" href="https://retroblog-anur.azurewebsites.net/" target="_blank" rel="noopener noreferrer">Live Demo</a>
        <a class="project-link" href="https://github.com/AnurZ/RetroBlog" target="_blank" rel="noopener noreferrer">GitHub</a>
        
      </div>
    </div>
     <p style="font-size: 0.85em; color: gray; font-style: italic;">
  ⏳ First load may take ~10s (free Azure hosting).
  </p>
    <p>Clean blog app with auth, CRUD for posts, pagination, and light/dark theming.</p>
    
    <div  class="project-media">
    <div style="padding:5px">Dark theme</div>
    <img src="images/darkTheme.PNG" alt="RetroBlog Screenshot" />
    <div style="padding:5px">Light theme</div>
      <img src="images/lightTheme.PNG" alt="RetroBlog Screenshot" />
    </div>

    <span class="section-label">Technologies Used</span>
    <div class="pill-row" aria-label="Technologies">
      <span class="pill">HTML</span>
      <span class="pill">CSS</span>
      <span class="pill">JavaScript</span>
      <span class="pill">Responsive UI</span>
      <span class="pill">Dark/Light Theme</span>
      <span class="pill">ASP.NET Core 9</span>
      <span class="pill">Web API</span>
      <span class="pill">Microsoft Identity</span>
      <span class="pill">Entity Framework Core</span>
      <span class="pill">Repository Pattern</span>
      <span class="pill">SQLite</span>
      <span class="pill">Swagger</span>
      <span class="pill">Postman</span>
      <span class="pill">Git & GitHub</span>
      <span class="pill">Visual Studio</span>
    </div>

    <span class="section-label">Key Features</span>
    <ul class="bullets">
      <li>Browse posts anonymously</li>
      <li>Register & login (Microsoft Identity)</li>
      <li>Create, edit, delete posts (auth only)</li>
      <li>API endpoints for posts & users</li>
      <li>Pagination for listing</li>
      <li>Dark / light theme toggle</li>
    </ul>
  </div>
</div>



`,

    Github: `<a href="https://github.com/AnurZ" target="_blank">https://github.com/AnurZ</a>`,
    Education: `<p> Bachelor's in Software Engineering <br>FIT Mostar. (ongoing)</p>`,
    Email: `<p>
  Contact me at:<br>
  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=anuranci@gmail.com&su=Portfolio Inquiry&body=Hi Anur," target="_blank">
  anuranci@gmail.com
</a>
</p>`,
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
