(() => {
  const CONFIG = window.ORIGIN_CONFIG || {};
  const MODE = CONFIG.mode || "auto";
  const ATTR = "data-origin-author";

  let overlayOpen = false;
  let lastFocusedBadge = null;

  /* ------------------ Styles ------------------ */
  const style = document.createElement("style");
  style.textContent = `
  .origin-badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0,0,0,.65);
    color: #fff;
    font: 600 14px system-ui,-apple-system;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(6px);
    opacity: .85;
    transition: opacity .2s ease, background .2s ease;
    z-index: 10;
  }

  .origin-badge:hover { opacity: 1; }
  .origin-badge:focus { outline: 2px solid #007aff; }

  /* Visual-only verified state */
  .origin-verified {
    background: rgba(0,122,255,.85);
  }

  .origin-hover .origin-badge {
    opacity: 0;
    pointer-events: none;
  }

  .origin-hover:hover .origin-badge,
  .origin-hover:focus-within .origin-badge {
    opacity: .85;
    pointer-events: auto;
  }

  .origin-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .origin-card {
    width: 320px;
    background: #fff;
    border-radius: 14px;
    padding: 18px;
    font: 14px system-ui,-apple-system;
    box-shadow: 0 20px 40px rgba(0,0,0,.15);
  }

  .origin-title {
    font-weight: 600;
    margin-bottom: 10px;
  }

  .origin-row {
    margin-bottom: 8px;
    color: #444;
  }

  .origin-row span {
    color: #888;
  }

  .origin-note {
    font-size: 12px;
    color: #888;
    margin-top: 10px;
  }

  .origin-close {
    margin-top: 14px;
    text-align: right;
    color: #007aff;
    cursor: pointer;
    font-weight: 500;
  }`;
  document.head.appendChild(style);

  /* ------------------ Utils ------------------ */
  const formatDate = d => {
    try {
      return new Date(d).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
    } catch {
      return d;
    }
  };

  /* ------------------ Overlay ------------------ */
  function openOverlay(data) {
    if (overlayOpen) return;
    overlayOpen = true;

    const overlay = document.createElement("div");
    overlay.className = "origin-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlay.innerHTML = `
      <div class="origin-card">
        <div class="origin-title">Content origin</div>

        <div class="origin-row"><span>Author:</span> ${data.author || "—"}</div>
        <div class="origin-row"><span>Source:</span> ${data.source || "—"}</div>
        <div class="origin-row"><span>Published:</span> ${data.date || "—"}</div>
        <div class="origin-row"><span>Type:</span> ${data.type || "—"}</div>
        ${data.verified
          ? `<div class="origin-row"><span>Status:</span> Publisher-verified</div>`
          : ""}

        <div class="origin-note">
          This shows origin metadata. It does not verify truth or trustworthiness.
        </div>

        <div class="origin-close" tabindex="0">Close</div>
      </div>
    `;

    const close = () => {
      overlay.remove();
      overlayOpen = false;
      document.removeEventListener("keydown", escHandler);
      if (lastFocusedBadge) lastFocusedBadge.focus();
    };

    overlay.addEventListener("click", e => {
      if (e.target === overlay) close();
    });

    const closeBtn = overlay.querySelector(".origin-close");
    closeBtn.onclick = close;
    closeBtn.onkeydown = e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        close();
      }
    };

    const escHandler = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", escHandler);
    document.body.appendChild(overlay);
    closeBtn.focus();
  }

  /* ------------------ Badge ------------------ */
  function attach(el) {
    if (MODE === "manual") return;

    if (getComputedStyle(el).position === "static")
      el.style.position = "relative";

    if (MODE === "hover") el.classList.add("origin-hover");

    const verified = el.dataset.originVerified === "true";

    const badge = document.createElement("div");
    badge.className = "origin-badge" + (verified ? " origin-verified" : "");
    badge.textContent = "i";
    badge.tabIndex = 0;
    badge.setAttribute("role", "button");
    badge.setAttribute("aria-label", "View content origin");

    const data = {
      author: el.dataset.originAuthor,
      source: el.dataset.originSource,
      date: formatDate(el.dataset.originDate),
      type: el.dataset.originType,
      verified
    };

    badge.onclick = () => {
      lastFocusedBadge = badge;
      openOverlay(data);
    };

    badge.onkeydown = e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        lastFocusedBadge = badge;
        openOverlay(data);
      }
    };

    el.appendChild(badge);
  }

  /* ------------------ Public API ------------------ */
  window.Origin = {
    show: el => {
      if (!el?.dataset) return;
      openOverlay({
        author: el.dataset.originAuthor,
        source: el.dataset.originSource,
        date: formatDate(el.dataset.originDate),
        type: el.dataset.originType,
        verified: el.dataset.originVerified === "true"
      });
    }
  };

  /* ------------------ Init ------------------ */
  const init = () =>
    document.querySelectorAll(`[${ATTR}]`).forEach(attach);

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
