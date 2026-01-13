# Sidebar Separators & Aliases

**Sidebar Separators & Aliases** is a Roam Research extension that helps you organise your left sidebar shortcuts with visual separators *and* optional per‑shortcut display aliases — without modifying your actual page titles.

---

## ✨ Features

### Sidebar separators
- Add up to **10 separators** to your left sidebar.
- Three separator styles:
  - **Horizontal line**
  - **Blank space**
  - **Label**
- Fine‑grained control per separator:
  - **Location** (by shortcut position, `0 = top`)
  - **Alignment** (`left`, `center`, `right`)
  - **Width** (10–100%)
  - **Colour** (HEX, theme‑aware fallback)
  - **Label text** and **font size** (for label separators)

### Shortcut aliases (new)
- Optionally define **display aliases** for individual sidebar shortcuts.
- Aliases affect **only the sidebar display**, not:
  - the page title
  - links
  - references
  - search
- Aliases are **keyed by page UID**, so they remain stable if you reorder shortcuts.

### Safer, lighter implementation
- No writes to your Roam graph — DOM‑only changes.
- Indexes, widths, and font sizes are clamped to safe ranges.
- Mutation observers are scoped tightly to avoid unnecessary work.
- All changes are fully reversible on unload.

---

## 🧭 How to use

1. Open **Roam Depot → Settings → Sidebar Separators & Aliases**.
2. Toggle **“Show Sidebar Separator Controls”** to configure separators.
3. Choose the **number of separators** you want (1–10).
4. For each separator, configure:
   - Style
   - Location (shortcut index)
   - Alignment
   - Width
   - Colour
   - Optional label text and font size
5. Toggle **“Show Shortcut Alias Controls”** to define per‑shortcut aliases.

> 💡 **Tip:**  
> To insert a separator between two groups of shortcuts, set the location to the index of the *first shortcut in the second group*.  
> Example: location `3` inserts the separator before your fourth shortcut.

---

## 🧠 Notes & behaviour

- If you rename a page:
  - Shortcut aliases remain attached to the page via its UID.
- Removing an alias instantly restores the original shortcut text.
- Removing the extension restores your sidebar exactly as Roam left it.

---

## 🔒 Safety & performance

- No mutation of block content or page titles.
- No polling loops — observers attach only when necessary.
- Designed to coexist safely with themes and other sidebar extensions.

---

## 📦 Changelog highlights

**New in “Sidebar Separators & Aliases”**
- Optional per‑shortcut aliases
- UID‑based aliasing (stable across reordering)
- Cleaner, dynamically sized settings panel
- Reduced observer overhead

---

Enjoy a cleaner, more readable sidebar ✨
