/* Shared behavior: background photo, forms, quiz links, light image protection. */
(function () {
  var CFG = window.SITE_CONFIG || {};
  var body = document.body;
  var page = body.getAttribute("data-page") || "home";
  var root = body.getAttribute("data-root") || "";
  var CACHE_KEY = "pv_bg_settings";
  var narrow = window.matchMedia("(max-width: 700px)");

  function safeGet(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function photoUrl(name) { return new URL(root + "img/photos/" + name + (narrow.matches ? "-sm" : "") + ".jpg", location.href).href; }
  function applyBg(name) {
    if (!name || (CFG.PHOTOS || []).indexOf(name) === -1) return;
    document.documentElement.style.setProperty("--bg", 'url("' + photoUrl(name) + '")');
    body.setAttribute("data-bg", name);
  }

  // 1) Instant: cached choice, or the default for this page.
  var cached = safeGet(CACHE_KEY) || {};
  var current = cached["bg_" + page] || (CFG.DEFAULT_BG || {})[page];
  applyBg(current);
  narrow.addEventListener && narrow.addEventListener("change", function () { applyBg(body.getAttribute("data-bg")); });

  // 2) Then check the live setting from the Google Sheet.
  if (CFG.API_URL && page !== "admin") {
    fetch(CFG.API_URL + "?action=settings", { method: "GET" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) return;
        safeSet(CACHE_KEY, data.settings || {});
        var live = (data.settings || {})["bg_" + page];
        if (live && live !== body.getAttribute("data-bg")) applyBg(live);
      })
      .catch(function () {});
  }

  // Quiz links
  document.querySelectorAll("[data-quiz]").forEach(function (a) { if (CFG.QUIZ_URL) a.href = CFG.QUIZ_URL; });

  // "Coming soon" rows do nothing
  document.querySelectorAll("[aria-disabled='true']").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Light image protection (stops casual right-click saving; not foolproof)
  document.querySelectorAll("img").forEach(function (img) { img.setAttribute("draggable", "false"); });
  document.addEventListener("contextmenu", function (e) { if (e.target && e.target.tagName === "IMG") e.preventDefault(); });

  // Forms -> Google Sheet
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var msg = form.querySelector(".form-msg");
    var btn = form.querySelector("button[type='submit']");
    var btnText = btn ? btn.textContent : "";
    function show(kind, text) { msg.className = "form-msg " + kind; msg.textContent = text; msg.hidden = false; }
    form.addEventListener("input", function () { if (msg.classList.contains("err")) msg.hidden = true; });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = Array.prototype.filter.call(form.querySelectorAll("[required]"), function (f) {
        return !f.value.trim() || !f.checkValidity();
      });
      if (missing.length) {
        var names = missing.map(function (f) {
          var l = form.querySelector('label[for="' + f.id + '"]');
          return l ? l.childNodes[0].textContent.trim().toLowerCase() : f.name;
        });
        show("err", "Add your " + names.join(", ") + " to send this.");
        missing[0].focus();
        return;
      }
      if (!CFG.API_URL) { show("err", "This form isn't connected yet. Add your Google Apps Script URL in assets/config.js."); return; }

      var data = { form: form.getAttribute("data-form"), page: location.pathname };
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });

      btn.disabled = true; btn.textContent = "Sending";
      fetch(CFG.API_URL, { method: "POST", body: JSON.stringify(data) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok) throw new Error("bad");
          form.reset();
          show("ok", form.getAttribute("data-success") || "Got it. I'll be in touch soon.");
        })
        .catch(function () { show("err", "That didn't go through. Check your connection and try again."); })
        .then(function () { btn.disabled = false; btn.textContent = btnText; });
    });
  });
})();
