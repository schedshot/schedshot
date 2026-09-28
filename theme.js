/* Load in <head> so the saved appearance is applied before rendering. */
(() => {
  const key = "schedshot-theme";
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: light)");
  const valid = value => value === "light" || value === "dark";
  let preference = null;
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch { /* Appearance still works when storage is unavailable. */ }

  function applyTheme() {
    const theme = preference || (system.matches ? "light" : "dark");
    root.dataset.theme = theme;
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const next = theme === "dark" ? "light" : "dark";
    document.getElementById("theme-icon").textContent = next === "light" ? "☀︎" : "☾";
    document.getElementById("theme-label").textContent = next === "light" ? "Light" : "Dark";
    toggle.setAttribute("aria-label", `Switch to ${next} mode`);
  }

  applyTheme();
  function initialize() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    applyTheme();
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme();
      try { localStorage.setItem(key, preference); } catch { /* Keep the in-page choice. */ }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
  system.addEventListener("change", () => { if (!preference) applyTheme(); });
  window.addEventListener("storage", event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : null;
    applyTheme();
  });
})();
