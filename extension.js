const NUM_SEPARATORS = 10;
const SEP_IDS = Array.from({ length: NUM_SEPARATORS }, (_, i) => `sidebar_sep_${i + 1}`);
const DEFAULT_LABEL_FONT_SIZE_REM = 0.75;

let separators = [];
let debugLogging = false;
let defaultSeparatorColor = "#999999";
let activeSeparatorCount = 1;

function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  if (typeof value === "number") return value !== 0;
  if (value && typeof value === "object") {
    if ("checked" in value) return !!value.checked;
    if (value.target && "checked" in value.target) return !!value.target.checked;
    if ("on" in value) return !!value.on;
  }
  return false;
}

function isValidHexColor(value) {
  if (typeof value !== "string") return false;
  const v = value.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

function clampWidth(rawWidth) {
  const num = Number(rawWidth);
  if (!Number.isFinite(num)) return 60;
  return Math.min(100, Math.max(10, num));
}

function clampLabelFontSize(rawSize) {
  const num = Number(rawSize);
  if (!Number.isFinite(num)) return DEFAULT_LABEL_FONT_SIZE_REM;
  return Math.min(3, Math.max(0.5, num));
}

function clampSeparatorCount(rawCount) {
  const num = Number(rawCount);
  if (!Number.isFinite(num)) return 1;
  return Math.min(NUM_SEPARATORS, Math.max(1, Math.round(num)));
}

function separatorLabelPrefix(n) {
  const labels = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];
  return labels[n - 1] || `Separator ${n}`;
}

function getShortcuts() {
  if (typeof document === "undefined") return { shortcutsParent: null, shortcuts: [] };

  const shortcutsParent = document.querySelector("div.starred-pages");
  const shortcuts = shortcutsParent
    ? Array.from(shortcutsParent.querySelectorAll(":scope > a"))
    : [];

  return { shortcutsParent, shortcuts };
}

function clearSeparators() {
  if (typeof document === "undefined") return;
  SEP_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function createSeparators() {
  if (typeof document === "undefined") return;

  clearSeparators();

  const { shortcutsParent, shortcuts } = getShortcuts();
  if (!shortcutsParent || !shortcuts.length) {
    if (debugLogging) {
      console.warn(
        "[sidebar-separators] No starred-pages container or no shortcuts found; skipping render."
      );
    }
    return;
  }

  for (let idx = 0; idx < activeSeparatorCount; idx++) {
    const sep = separators[idx];
    if (!sep) continue;

    let { style, location, align, width, color, label } = sep;
    const labelSize = clampLabelFontSize(sep.labelSize);

    // Skip if no location configured
    if (location === null || location === undefined || location === "") continue;

    const rawIndex = Number(location);
    if (!Number.isFinite(rawIndex)) continue;

    // Clamp index to [0, shortcuts.length]
    const index = Math.max(0, Math.min(rawIndex, shortcuts.length));
    const refNode = shortcuts[index] ?? null;

    const effectiveStyle = style || "Horizontal Line";
    const effectiveAlign = align || "center";
    const effectiveWidth = clampWidth(width);
    const effectiveColor = isValidHexColor(color) ? color.trim() : defaultSeparatorColor;

    let node;

    if (effectiveStyle === "Blank Space") {
      node = document.createElement("br");
    } else if (effectiveStyle === "Label") {
      node = document.createElement("div");
      node.textContent = label || "";
      node.style.fontSize = `${labelSize}rem`;
      node.style.opacity = "0.8";
      node.style.paddingTop = "4px";
      node.style.paddingBottom = "2px";
      node.style.marginBottom = "6px";
      node.style.borderBottom = `1px solid ${effectiveColor}`;
      node.style.color = effectiveColor;
      node.style.width = `${effectiveWidth}%`;
    } else {
      // Horizontal Line (default)
      node = document.createElement("hr");
      node.style.width = `${effectiveWidth}%`;
      node.style.border = `1px solid ${effectiveColor}`;
      node.style.backgroundColor = effectiveColor;
      node.style.marginTop = "4px";
      node.style.marginBottom = "4px";
    }

    // Alignment
    if (effectiveAlign === "left") {
      node.style.marginLeft = "8px";
      node.style.marginRight = "auto";
    } else if (effectiveAlign === "right") {
      node.style.marginLeft = "auto";
      node.style.marginRight = "8px";
    } else {
      // center
      node.style.marginLeft = "auto";
      node.style.marginRight = "auto";
    }

    node.id = SEP_IDS[idx];

    try {
      shortcutsParent.insertBefore(node, refNode);
    } catch (e) {
      if (debugLogging) {
        console.error(
          `[sidebar-separators] Failed to insert separator index ${idx} at position ${index}`,
          e
        );
      }
    }
  }

  if (debugLogging) {
    console.log("[sidebar-separators] Rendered separators", {
      separators,
      activeSeparatorCount,
      shortcutsCount: getShortcuts().shortcuts.length,
    });
  }
}

function updateSeparator(index, field, evt) {
  if (!separators[index]) return;

  const sep = separators[index];

  if (field === "location") {
    const raw = evt?.target?.value ?? evt ?? "";
    const trimmed = String(raw).trim();
    sep.location = trimmed === "" ? null : trimmed;
  } else if (field === "width") {
    const raw = evt?.target?.value ?? evt ?? "";
    const trimmed = String(raw).trim();
    sep.width = trimmed === "" ? "60" : trimmed;
  } else if (field === "color") {
    const raw = evt?.target?.value ?? evt ?? "";
    const trimmed = String(raw).trim();
    sep.color = trimmed || defaultSeparatorColor;
  } else if (field === "label") {
    const raw = evt?.target?.value ?? evt ?? "";
    sep.label = String(raw);
  } else if (field === "style") {
    // For select controls, evt is the value
    sep.style = evt || "Horizontal Line";
  } else if (field === "align") {
    sep.align = evt || "center";
  } else if (field === "labelSize") {
    const raw = evt?.target?.value ?? evt ?? DEFAULT_LABEL_FONT_SIZE_REM;
    sep.labelSize = String(raw);
  }

  createSeparators();
}

export default {
  onload: ({ extensionAPI }) => {
    try {
      if (typeof document !== "undefined") {
        const body = document.body;
        if (body) {
          const computed = window.getComputedStyle(body);
          const borderColor =
            computed.getPropertyValue("--border-color").trim() ||
            computed.getPropertyValue("--secondary-text-color").trim() ||
            computed.getPropertyValue("color").trim();
          if (borderColor && borderColor !== "inherit") {
            defaultSeparatorColor = isValidHexColor(borderColor)
              ? borderColor
              : "#999999";
          }
        }
      }
    } catch (e) {
      // Fall back to default #999999 if anything goes wrong
      defaultSeparatorColor = "#999999";
    }

    // Load debug setting
    debugLogging = toBool(extensionAPI.settings.get("ss-debug"));
    activeSeparatorCount = clampSeparatorCount(extensionAPI.settings.get("ss-count") ?? 1);

    separators = Array.from({ length: NUM_SEPARATORS }, (_, i) => {
      const n = i + 1;
      const style = extensionAPI.settings.get(`ss-${n}`) || "Horizontal Line";
      const locRaw = extensionAPI.settings.get(`ss-${n}L`);
      const align = extensionAPI.settings.get(`ss-${n}A`) || "center";
      const width = extensionAPI.settings.get(`ss-${n}W`) || "60";
      const color =
        extensionAPI.settings.get(`ss-${n}C`) || defaultSeparatorColor;
      const label = extensionAPI.settings.get(`ss-${n}T`) || "";
      const labelSize =
        extensionAPI.settings.get(`ss-${n}FS`) || DEFAULT_LABEL_FONT_SIZE_REM;

      let location = null;
      if (locRaw !== undefined && locRaw !== null && String(locRaw).trim() !== "") {
        location = String(locRaw).trim();
      }

      return {
        style,
        location,
        align,
        width: String(width),
        color: String(color),
        label: String(label),
        labelSize: String(labelSize),
      };
    });

    const buildSettingsConfig = () => {
      const settings = [
        {
          id: "ss-count",
          name: "Number of separators",
          description: "Start with one and add more when needed (max 10).",
          action: {
            type: "select",
            items: Array.from({ length: NUM_SEPARATORS }, (_, i) => String(i + 1)),
            onChange: (value) => {
              const nextCount = clampSeparatorCount(value);
              if (nextCount === activeSeparatorCount) return;
              activeSeparatorCount = nextCount;
              try {
                extensionAPI.settings.set("ss-count", activeSeparatorCount);
              } catch (e) {
                if (debugLogging) {
                  console.warn("[sidebar-separators] Failed to persist count", e);
                }
              }
              createSeparators();
              extensionAPI.settings.panel.create(buildSettingsConfig());
            },
          },
        },
      ];

      for (let i = 0; i < activeSeparatorCount; i++) {
        const n = i + 1;
        const labelPrefix = separatorLabelPrefix(n);

        settings.push({
          id: `ss-${n}`,
          name: `${labelPrefix} Separator Style`,
          description: "Choose how this separator appears.",
          action: {
            type: "select",
            items: ["Horizontal Line", "Blank Space", "Label"],
            onChange: (value) => updateSeparator(i, "style", value),
          },
        });

        settings.push({
          id: `ss-${n}L`,
          name: `${labelPrefix} Separator location`,
          description:
            "Insert at which shortcut position (0 = top). Value will be clamped to the available shortcuts.",
          action: {
            type: "input",
            placeholder: "integer (e.g. 3)",
            onChange: (evt) => updateSeparator(i, "location", evt),
          },
        });

        settings.push({
          id: `ss-${n}A`,
          name: `${labelPrefix} Separator alignment`,
          description: "Align the separator within the shortcuts column.",
          action: {
            type: "select",
            items: ["center", "left", "right"],
            onChange: (value) => updateSeparator(i, "align", value),
          },
        });

        settings.push({
          id: `ss-${n}W`,
          name: `${labelPrefix} Separator width`,
          description: "Width as integer % between 10 and 100.",
          action: {
            type: "input",
            placeholder: "60",
            onChange: (evt) => updateSeparator(i, "width", evt),
          },
        });

        settings.push({
          id: `ss-${n}C`,
          name: `${labelPrefix} Separator colour`,
          description:
            "Colour as HEX (e.g. #999999). If invalid, a theme-matched default will be used.",
          action: {
            type: "input",
            placeholder: defaultSeparatorColor,
            onChange: (evt) => updateSeparator(i, "color", evt),
          },
        });

        settings.push({
          id: `ss-${n}T`,
          name: `${labelPrefix} Separator label text`,
          description:
            'Optional text shown when style is set to "Label" (ignored for other styles).',
          action: {
            type: "input",
            placeholder: "Projects, Planning, etc.",
            onChange: (evt) => updateSeparator(i, "label", evt),
          },
        });

        settings.push({
          id: `ss-${n}FS`,
          name: `${labelPrefix} Separator label font size`,
          description:
            'Font size in rem (e.g. 0.75). Clamped between 0.5 and 3 rem. Used when style is set to "Label" (ignored for other styles).',
          action: {
            type: "input",
            placeholder: String(DEFAULT_LABEL_FONT_SIZE_REM),
            onChange: (evt) => updateSeparator(i, "labelSize", evt),
          },
        });
      }

      /* // possible future debug setting
      settings.push({
        id: "ss-debug",
        name: "Debug logging",
        description:
          "Log sidebar separator layout details to the console (useful for troubleshooting).",
        action: {
          type: "switch",
          onChange: (value) => {
            debugLogging = toBool(value);
            createSeparators();
          },
        },
      });
      */

      return {
        tabTitle: "Sidebar Separators",
        settings,
      };
    };

    extensionAPI.settings.panel.create(buildSettingsConfig());

    createSeparators();
  },

  onunload: () => {
    clearSeparators();
  },
};
