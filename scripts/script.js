/* =====================================================================
   AnurOS: a tiny window manager for the portfolio.
   - several windows at once (drag, resize, minimise, maximise, focus)
   - dock + desktop icons, dark mode, simple one-page view
   - screenshot lightbox, a small terminal, #hash deep links
   No dependencies, no build step.
   ===================================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode etc. */ } },
  };

  const root = document.documentElement;
  const layer = $("#windows");
  const activeAppEl = $("#active-app");
  const isSmall = () => window.matchMedia("(max-width: 760px)").matches;

  const apps = {};
  $$("template[id^='tpl-']").forEach((tpl) => {
    const id = tpl.id.slice(4);
    apps[id] = {
      id,
      tpl,
      title: tpl.dataset.title || id,
      w: +tpl.dataset.w || 720,
      h: +tpl.dataset.h || 520,
    };
  });

  /* ---------------------------------------------------------------
     Window manager
     --------------------------------------------------------------- */
  const wins = new Map(); // id -> element
  let z = 10;

  function openApp(id) {
    const app = apps[id];
    if (!app) return;
    if (document.body.classList.contains("is-simple")) {
      const target = document.getElementById(`s-${id}`);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    let win = wins.get(id);
    if (!win) win = createWindow(app);
    win.hidden = false;
    win.classList.remove("is-minimizing");
    focusWin(win);
    setHash(id);
  }

  function createWindow(app) {
    const win = document.createElement("section");
    win.className = "win";
    win.dataset.app = app.id;
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", app.title);
    win.innerHTML = `
      <div class="win-bar">
        <div class="lights">
          <button class="light close" type="button" aria-label="Close ${app.title}"></button>
          <button class="light min" type="button" aria-label="Minimise ${app.title}"></button>
          <button class="light max" type="button" aria-label="Maximise ${app.title}"></button>
        </div>
        <span class="win-title">${app.title}</span>
      </div>
      <div class="win-body"></div>
      <div class="win-resize" aria-hidden="true"></div>`;

    const body = $(".win-body", win);
    body.appendChild(app.tpl.content.cloneNode(true));
    // ids inside windows would clash with the simple view's anchors
    $$("[id^='s-']", body).forEach((el) => el.removeAttribute("id"));
    if (app.id === "terminal") body.classList.add("no-pad");

    // size + cascade position
    const vw = window.innerWidth;
    const vh = window.innerHeight - 38 - 96;
    const w = Math.min(app.w, vw - 40);
    const h = Math.min(app.h, vh - 20);
    const n = $$(".win:not([hidden])", layer).length;
    const minLeft = vw > 1100 ? 200 : 20;
    const left = Math.max(minLeft, Math.min((vw - w) / 2 + n * 28 - 40, vw - w - 20));
    const top = Math.max(16, Math.min(24 + n * 28, vh - h));
    Object.assign(win.style, { width: `${w}px`, height: `${h}px`, left: `${left}px`, top: `${top}px` });

    layer.appendChild(win);
    wins.set(app.id, win);
    wire(win, app);
    if (app.id === "terminal") initTerminal(win);
    updateDock();
    return win;
  }

  function focusWin(win) {
    $$(".win.is-active", layer).forEach((w) => w.classList.remove("is-active"));
    win.classList.add("is-active");
    win.style.zIndex = ++z;
    activeAppEl.textContent = apps[win.dataset.app].title;
  }

  function topVisibleWin() {
    return $$(".win:not([hidden])", layer).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  }

  function afterHide() {
    const next = topVisibleWin();
    if (next) {
      focusWin(next);
      setHash(next.dataset.app);
    } else {
      activeAppEl.textContent = "Desktop";
      setHash("");
    }
    updateDock();
  }

  function closeWin(win) {
    win.classList.add("is-closing");
    setTimeout(() => {
      wins.delete(win.dataset.app);
      win.remove();
      afterHide();
    }, 150);
  }

  function minimizeWin(win) {
    win.classList.add("is-minimizing");
    setTimeout(() => {
      win.hidden = true;
      win.classList.remove("is-minimizing");
      afterHide();
    }, 240);
  }

  function wire(win, app) {
    const bar = $(".win-bar", win);
    $(".light.close", win).addEventListener("click", () => closeWin(win));
    $(".light.min", win).addEventListener("click", () => minimizeWin(win));
    $(".light.max", win).addEventListener("click", () => win.classList.toggle("is-max"));
    bar.addEventListener("dblclick", (e) => {
      if (!e.target.closest(".lights")) win.classList.toggle("is-max");
    });
    win.addEventListener("pointerdown", () => {
      focusWin(win);
      setHash(app.id);
    });

    // drag
    let drag = null;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".lights") || win.classList.contains("is-max") || isSmall()) return;
      drag = { x: e.clientX - win.offsetLeft, y: e.clientY - win.offsetTop };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const maxX = window.innerWidth - 120;
      const maxY = window.innerHeight - 38 - 60;
      win.style.left = `${Math.min(Math.max(e.clientX - drag.x, -win.offsetWidth + 160), maxX)}px`;
      win.style.top = `${Math.min(Math.max(e.clientY - drag.y, 0), maxY)}px`;
    });
    const stop = () => (drag = null);
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);

    // resize
    const grip = $(".win-resize", win);
    let rs = null;
    grip.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      rs = { x: e.clientX, y: e.clientY, w: win.offsetWidth, h: win.offsetHeight };
      grip.setPointerCapture(e.pointerId);
    });
    grip.addEventListener("pointermove", (e) => {
      if (!rs) return;
      win.style.width = `${Math.max(320, rs.w + e.clientX - rs.x)}px`;
      win.style.height = `${Math.max(200, rs.h + e.clientY - rs.y)}px`;
    });
    grip.addEventListener("pointerup", () => (rs = null));
  }

  function updateDock() {
    $$(".dock-item[data-open]").forEach((d) => d.classList.toggle("is-open", wins.has(d.dataset.open)));
  }

  function setHash(id) {
    if (!history.replaceState) return;
    history.replaceState(null, "", id ? `#${id}` : location.pathname + location.search);
  }

  // Any [data-open] element opens an app (icons, dock, buttons inside windows)
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) {
      e.preventDefault();
      openApp(t.dataset.open);
    }
  });

  /* ---------------------------------------------------------------
     Theme
     --------------------------------------------------------------- */
  const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = () => root.getAttribute("data-theme") || (prefersDark() ? "dark" : "light");

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    store.set("az-theme", t);
  }

  $("#theme-toggle").addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));

  /* ---------------------------------------------------------------
     Simple (one-page) view
     --------------------------------------------------------------- */
  const simple = $("#simple");
  const viewBtn = $("#view-toggle");
  let simpleBuilt = false;

  function buildSimple() {
    if (simpleBuilt) return;
    const host = $("#simple-content");
    Object.values(apps).forEach((app) => {
      if (app.tpl.dataset.simple === "skip") return;
      host.appendChild(app.tpl.content.cloneNode(true));
    });
    simpleBuilt = true;
  }

  function setView(mode, { save = true } = {}) {
    const on = mode === "simple";
    if (on) buildSimple();
    document.body.classList.toggle("is-simple", on);
    simple.hidden = !on;
    viewBtn.setAttribute("aria-pressed", String(on));
    $("span", viewBtn).textContent = on ? "Desktop view" : "Simple view";
    viewBtn.title = on ? "Switch to the desktop view" : "Switch to a plain one-page view";
    activeAppEl.textContent = on ? "Simple view" : topVisibleWin() ? apps[topVisibleWin().dataset.app].title : "Desktop";
    if (save) store.set("az-view", mode);
    if (on) window.scrollTo(0, 0);
    else if (!topVisibleWin()) openApp("about");
  }

  viewBtn.addEventListener("click", () => setView(document.body.classList.contains("is-simple") ? "desktop" : "simple"));
  $("#back-to-desktop").addEventListener("click", () => setView("desktop"));

  /* ---------------------------------------------------------------
     Lightbox
     --------------------------------------------------------------- */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  const lbCap = $("#lb-cap");
  let lbItems = [];
  let lbIndex = 0;
  let lbOpener = null;

  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    lbImg.src = it.dataset.src;
    lbImg.alt = $("img", it)?.alt || "";
    lbCap.textContent = `${it.dataset.cap || ""}  (${lbIndex + 1}/${lbItems.length})`;
  }

  document.addEventListener("click", (e) => {
    const shot = e.target.closest(".shot");
    if (!shot) return;
    lbItems = $$(".shot", shot.closest(".gallery"));
    lbOpener = shot;
    lb.hidden = false;
    $$(".lb-nav", lb).forEach((b) => (b.hidden = lbItems.length < 2));
    showLb(lbItems.indexOf(shot));
    $(".lb-close", lb).focus();
  });

  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    if (lbOpener) lbOpener.focus();
  }

  $(".lb-close", lb).addEventListener("click", closeLb);
  $(".lb-prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  $(".lb-next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.tagName === "FIGURE") closeLb();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      return;
    }
    if (e.key === "Escape" && !document.body.classList.contains("is-simple")) {
      const top = topVisibleWin();
      if (top) closeWin(top);
    }
  });

  /* ---------------------------------------------------------------
     Terminal
     --------------------------------------------------------------- */
  const LINKS = {
    cv: "cv/Anur-Zjakic-CV.pdf",
    github: "https://github.com/AnurZ",
    linkedin: "https://www.linkedin.com/in/anur-zjaki%C4%87-0169a5309",
    email: "mailto:anur.zjakic.dev@gmail.com?subject=Junior%20developer%20role",
  };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function initTerminal(win) {
    const out = $(".term-out", win);
    const form = $(".term-line", win);
    const input = $(".term-input", win);
    const history = [];
    let hi = 0;

    const print = (html) => {
      out.insertAdjacentHTML("beforeend", html + "\n");
      win.querySelector(".win-body").scrollTop = 1e9;
    };
    const go = (url) => window.open(url, url.startsWith("mailto:") ? "_self" : "_blank", "noopener");

    const commands = {
      help: () =>
        print(
          [
            '<span class="t-acc">Commands</span>',
            "  whoami            who I am",
            "  projects          open my projects",
            "  experience        open my experience",
            "  skills | stack    what I work with",
            "  contact           how to reach me",
            "  cv | github | linkedin | email",
            "  neofetch          system info, portfolio edition",
            "  theme [dark|light]",
            "  simple            switch to the one-page view",
            "  ls, date, clear, exit",
          ].join("\n")
        ),
      whoami: () => print("Anur Zjakić: junior full-stack developer (.NET · Angular · Flutter), Mostar, BiH. Open to work."),
      ls: () => print('<span class="t-acc">projects/  experience/  skills/  education/  contact/</span>  cv.pdf  README.md'),
      "cat readme.md": () => commands.whoami(),
      projects: () => (openApp("projects"), print('<span class="t-ok">Opening Projects…</span>')),
      experience: () => (openApp("experience"), print('<span class="t-ok">Opening Experience…</span>')),
      education: () => (openApp("education"), print('<span class="t-ok">Opening Education…</span>')),
      about: () => (openApp("about"), print('<span class="t-ok">Opening About me…</span>')),
      contact: () => (openApp("contact"), print('<span class="t-ok">Opening Contact…</span>')),
      skills: () =>
        print(
          [
            '<span class="t-acc">backend </span> C#, ASP.NET Core, EF Core, SignalR, RabbitMQ, IdentityServer',
            '<span class="t-acc">frontend</span> Angular, TypeScript, RxJS, Flutter, Vue/Nuxt',
            '<span class="t-acc">data    </span> SQL Server, PostgreSQL, MySQL, SQLite',
            '<span class="t-acc">devops  </span> Docker, Azure, Azure DevOps, GitHub Actions',
            '<span class="t-acc">practice</span> TDD, xUnit, clean architecture, XP',
          ].join("\n")
        ),
      stack: () => commands.skills(),
      cv: () => (go(LINKS.cv), print("Opening cv.pdf…")),
      "cat cv.pdf": () => commands.cv(),
      github: () => (go(LINKS.github), print("Opening github.com/AnurZ…")),
      linkedin: () => (go(LINKS.linkedin), print("Opening LinkedIn…")),
      email: () => (go(LINKS.email), print("Opening your mail app…")),
      date: () => print(new Date().toString()),
      clear: () => (out.innerHTML = ""),
      simple: () => setView("simple"),
      exit: () => closeWin(win),
      neofetch: () =>
        print(
          [
            '<span class="t-acc"> ┌────────┐ </span>  <span class="t-ok">anur</span>@<span class="t-ok">anur-os</span>',
            '<span class="t-acc"> │        │ </span>  -------------------',
            '<span class="t-acc"> │   AZ   │ </span>  <span class="t-acc">Role</span>: Junior Full-Stack Developer',
            '<span class="t-acc"> │        │ </span>  <span class="t-acc">Uni</span>: FIT Mostar, SE (2027)',
            '<span class="t-acc"> └────────┘ </span>  <span class="t-acc">Shell</span>: C# / TypeScript / Dart',
            '<span class="t-acc">            </span>  <span class="t-acc">Latest</span>: GymLink (.NET 10 + Flutter)',
            '<span class="t-acc">            </span>  <span class="t-acc">Status</span>: open to junior roles',
          ].join("\n")
        ),
      "sudo hire anur": () => {
        print('<span class="t-ok">[sudo] permission granted ✓</span> Opening your mail app…');
        setTimeout(() => go(LINKS.email), 600);
      },
    };

    print('<span class="t-dim">AnurOS terminal · type</span> <span class="t-acc">help</span> <span class="t-dim">to see commands</span>');

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      input.value = "";
      if (!raw) return;
      history.push(raw);
      hi = history.length;
      print(`<span class="prompt">guest@anur-os:~$</span> ${esc(raw)}`);
      const cmd = raw.toLowerCase().replace(/\s+/g, " ");
      if (commands[cmd]) return commands[cmd]();
      const [name, arg] = cmd.split(" ");
      if (name === "theme") {
        const t = arg === "dark" || arg === "light" ? arg : currentTheme() === "dark" ? "light" : "dark";
        setTheme(t);
        return print(`Theme set to ${t}.`);
      }
      if (name === "open" && apps[arg]) return commands[arg] ? commands[arg]() : openApp(arg);
      if (name === "sudo") return print('<span class="t-err">Nice try.</span> (hint: sudo hire anur)');
      print(`<span class="t-err">command not found:</span> ${esc(name)}. Type <span class="t-acc">help</span>.`);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && hi > 0) input.value = history[--hi];
      else if (e.key === "ArrowDown") input.value = hi < history.length - 1 ? history[++hi] : ((hi = history.length), "");
      else return;
      e.preventDefault();
    });

    $(".term", win).addEventListener("click", () => input.focus());
    setTimeout(() => input.focus(), 60);
  }

  /* ---------------------------------------------------------------
     Clock + first view
     --------------------------------------------------------------- */
  const clock = $("#clock");
  const tick = () =>
    (clock.textContent = new Date()
      .toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" })
      .replace(",", ""));
  tick();
  setInterval(tick, 30000);

  const hash = location.hash.slice(1);
  const params = new URLSearchParams(location.search);
  if (params.get("view") === "simple" || hash === "simple" || hash.startsWith("s-")) {
    setView("simple", { save: false });
    if (hash.startsWith("s-")) setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 50);
  } else if (store.get("az-view") === "simple") {
    setView("simple", { save: false });
  } else {
    openApp(apps[hash] ? hash : "about");
  }
})();
