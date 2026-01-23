# Origin.js

A tiny, client-side utility that surfaces **content origin metadata**  
(author, source, timestamp, type) directly in the UI.

**Origin.js does not verify truth.**  
It only shows what the publisher chooses to disclose.

---

## What this is

Origin.js adds a small, unobtrusive “Origin” badge to content elements.
When activated, it displays metadata already present in the HTML.

- Works on static sites
- No backend
- No build step
- No tracking
- No verification claims

---

## What this is NOT

This library:

- ❌ does NOT fact-check content  
- ❌ does NOT prove authenticity  
- ❌ does NOT prevent misinformation  
- ❌ does NOT cryptographically verify authorship  

If you need verification, signatures, or trust guarantees, this is the
**wrong tool**.

Origin.js is about **transparency**, not **truth**.

---

## Why this exists

Modern content spreads faster than context.

Origin.js makes it easier for readers to see:
- Who claims authorship
- Where content comes from
- When it was published
- What kind of content it is

Nothing more. Nothing hidden.

---

## Installation

Add one script tag:

```html
<script src="https://your-site.netlify.app/origin.min.js"></script>
