Organise your left sidebar shortcuts with separators.

**New in this version:**
- Text labels as an option instead of just a horizontal rule or blank space
- Adjustable font size for label separators
- Settings panel dynamically shows only the separators you’ve enabled (no more huge list)
- Safer handling of positions and sizes (indices are clamped to your actual shortcut list; widths and font sizes are kept in sensible ranges)

*Previously:*
- Define up to 10 different separators for your sidebar
- Set the colour, width and alignment for each separator

Sometimes you just want some visual separation between your list of shortcuts. This extension allows you to add a horizontal line, blank space, or a small label between any of your shortcuts to make sections easier to scan.

![image](https://user-images.githubusercontent.com/6857790/219263679-cd1ab703-bc54-49c3-a7a0-a82016b66199.png)


### How it works

- Open Roam Depot → Settings → **Sidebar Separators**.
- Choose the **Number of separators** you want (1–10). The panel will expand to show settings for each active separator.
- For each separator, you can configure:
  - **Style**: `Horizontal Line`, `Blank Space`, or `Label`
  - **Location**: the shortcut *position* to insert at (`0 = top`, `1 = before your second shortcut`, etc.). The value is clamped so it never crashes if you don’t have that many shortcuts.
  - **Alignment**: `center`, `left`, or `right`
  - **Width**: as a percentage (10–100%)
  - **Colour**: HEX (e.g. `#999999`). If invalid, a theme-matched default is used.
  - **Label text** and **label font size** (when style is set to `Label`)

> 📝 Tip: If you just want one separator between two “clusters” of shortcuts, set the location to the index of the first shortcut in the second cluster (e.g. `3` to insert before your fourth shortcut).
