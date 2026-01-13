const NUM_SEPARATORS = 10;
const SEP_IDS = Array.from({ length: NUM_SEPARATORS }, (_, i) => `sidebar_sep_${i + 1}`);
const DEFAULT_LABEL_FONT_SIZE_REM = 0.75;
const DEBUG = false;

let separators = [];
let defaultSeparatorColor = "#999999";
let activeSeparatorCount = 1;
let shortcutsObserver = null;
let settingsRefreshTimer = null;
let shortcutsUpdateTimer = null;
let lastShortcutsSignature = "";
let shortcutsParent = null;
let shortcutsParentObserver = null;
let isRendering = false;
let aliasOverridesByUid = {};

function debugLog(...args) {
  if (!DEBUG) return;
  console.log("[sidebar-separators-aliases]", ...args);
}

function getSettingBool(extensionAPI, key, fallback = false) {
  const raw = extensionAPI.settings.get(key);
  if (raw === undefined || raw === null) return fallback;
  if (typeof raw === "boolean") return raw;
  const normalized = String(raw).trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  if (normalized === "1" || normalized === "yes" || normalized === "on") return true;
  if (normalized === "0" || normalized === "no" || normalized === "off") return false;
  return fallback;
}

function ensureSettingBool(extensionAPI, key, fallback = false) {
  const current = extensionAPI.settings.get(key);
  if (current === undefined || current === null) {
    extensionAPI.settings.set(key, fallback);
    return fallback;
  }
  return getSettingBool(extensionAPI, key, fallback);
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

function getShortcutUid(node) {
  const href = node?.getAttribute?.("href") ?? "";
  const match = href.match(/\/page\/([^/?#]+)/);
  return match ? match[1] : "";
}

function getShortcutDisplayName(node) {
  const pageNode = node?.querySelector?.(".page");
  const name = pageNode?.getAttribute("data-ss-original")
    ?? pageNode?.textContent
    ?? node?.textContent
    ?? "";
  return String(name).trim();
}

function getShortcutNames(shortcuts) {
  return shortcuts.map((node) => {
    const text = node?.textContent ?? "";
    return String(text).trim();
  });
}

function getShortcutsSignature(shortcuts) {
  if (!shortcuts.length) return "";
  return shortcuts
    .map((n) => getShortcutUid(n))
    .filter(Boolean)
    .join("|");
}

function getShortcutNameForLocation(location, shortcuts) {
  if (location === null || location === undefined || location === "") return "";
  const rawIndex = Number(location);
  if (!Number.isFinite(rawIndex)) return "";
  const index = Math.trunc(rawIndex);
  if (index < 0 || index >= shortcuts.length) return "";
  const node = shortcuts[index];
  const pageNode = node?.querySelector?.(".page");
  const name = (pageNode?.textContent ?? node?.textContent ?? "");
  return String(name).trim();
}

function applyShortcutAliases(shortcuts) {
  shortcuts.forEach((node) => {
    if (!node) return;

    const uid = getShortcutUid(node);
    const pageNode = node.querySelector?.(".page");
    const target = pageNode || node;

    // Capture original once per DOM node
    if (!target.hasAttribute("data-ss-original")) {
      target.setAttribute("data-ss-original", String(target.textContent ?? ""));
    }

    const alias = uid ? aliasOverridesByUid[uid] : "";
    if (alias) {
      target.textContent = alias;
    } else {
      const fallback = target.getAttribute("data-ss-original");
      if (fallback !== null) target.textContent = fallback;
    }
  });
}

function clearShortcutAliases() {
  const { shortcuts } = getShortcuts();
  shortcuts.forEach((node) => {
    const pageNode = node.querySelector?.(".page");
    const target = pageNode || node;
    const original = target.getAttribute("data-ss-original");
    if (original !== null) {
      target.textContent = original;
      target.removeAttribute("data-ss-original");
    }
  });
}

function clearSeparators() {
  if (typeof document === "undefined") return;
  SEP_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function getAliasForUid(extensionAPI, uid) {
  const raw = extensionAPI.settings.get(`ss-alias-uid-${uid}`);
  const trimmed = raw === undefined || raw === null ? "" : String(raw).trim();
  return trimmed || "";
}

function createSeparators() {
  if (typeof document === "undefined") return;
  if (isRendering) return;
  isRendering = true;

  try {
    clearSeparators();

    const { shortcutsParent, shortcuts } = getShortcuts();
    if (!shortcutsParent || !shortcuts.length) {
      console.warn(
        "[sidebar-separators] No starred-pages container or no shortcuts found; skipping render."
      );
      return;
    }

    applyShortcutAliases(shortcuts);

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
      const index = Math.max(0, Math.min(Math.trunc(rawIndex), shortcuts.length));
      const refNode = shortcuts[index] ?? null;

      const effectiveStyle = style || "Horizontal Line";
      const effectiveAlign = align || "center";
      const effectiveWidth = clampWidth(width);
      const effectiveColor = isValidHexColor(color) ? color.trim() : defaultSeparatorColor;
    const effectiveLabel = label ? String(label) : "";

      let node;

      if (effectiveStyle === "Blank Space") {
        node = document.createElement("br");
      } else if (effectiveStyle === "Label") {
        node = document.createElement("div");
        node.textContent = effectiveLabel || "";
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
        console.error(
          `[sidebar-separators] Failed to insert separator index ${idx} at position ${index}`,
          e
        );
      }
    }
  } finally {
    isRendering = false;
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

function scheduleSettingsRefresh(extensionAPI, delay = 80) {
  if (settingsRefreshTimer) clearTimeout(settingsRefreshTimer);
  settingsRefreshTimer = setTimeout(() => {
    extensionAPI.settings.panel.create(buildSettingsConfig(extensionAPI));
  }, delay);
}

function scheduleShortcutsUpdate(extensionAPI, delay = 80) {
  if (shortcutsUpdateTimer) clearTimeout(shortcutsUpdateTimer);
  shortcutsUpdateTimer = setTimeout(() => {
    if (isRendering) return;
    const { shortcuts } = getShortcuts();
    const signature = getShortcutsSignature(shortcuts);
    debugLog("Shortcut census", {
      count: shortcuts.length,
      signature,
      names: getShortcutNames(shortcuts),
    });
    if (signature !== lastShortcutsSignature) {
      lastShortcutsSignature = signature;
      debugLog("Shortcut signature changed; refreshing settings + separators.");
      createSeparators();
      scheduleSettingsRefresh(extensionAPI);
      return;
    }
    debugLog("Shortcut signature unchanged; refreshing separators only.");
    createSeparators();
  }, delay);
}

function observeShortcuts(extensionAPI) {
  if (typeof document === "undefined") return;
  if (shortcutsObserver) shortcutsObserver.disconnect();

  const attachObserver = () => {
    const { shortcutsParent: nextParent, shortcuts } = getShortcuts();
    if (!nextParent) return false;

    if (shortcutsParent !== nextParent) {
      if (shortcutsObserver) shortcutsObserver.disconnect();
      shortcutsParent = nextParent;
      lastShortcutsSignature = getShortcutsSignature(shortcuts);
      debugLog("Attached shortcuts observer.", {
        count: shortcuts.length,
        signature: lastShortcutsSignature,
      });
      shortcutsObserver = new MutationObserver(() => {
        if (isRendering) return;
        scheduleShortcutsUpdate(extensionAPI);
      });
      shortcutsObserver.observe(shortcutsParent, {
        childList: true,
        subtree: false,
      });
    }
    return true;
  };

  const ensureParentObserver = () => {
    if (shortcutsParentObserver) return;
    shortcutsParentObserver = new MutationObserver(() => {
      const attached = attachObserver();
      if (attached) scheduleShortcutsUpdate(extensionAPI, 50);
    });
    shortcutsParentObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  const attached = attachObserver();
  if (!attached) {
    ensureParentObserver();
  }
}

function buildSettingsConfig(extensionAPI) {
  const { shortcuts } = getShortcuts();

  // build in-memory map for quick application
  aliasOverridesByUid = {};
  shortcuts.forEach((node) => {
    const uid = getShortcutUid(node);
    if (!uid) return;
    const alias = getAliasForUid(extensionAPI, uid);
    if (alias) aliasOverridesByUid[uid] = alias;
  });

  const showSeparators = ensureSettingBool(extensionAPI, "ss-show-separators", false);
  const showAliases = ensureSettingBool(extensionAPI, "ss-show-aliases", false);
  const settings = [
    {
      id: "ss-show-separators",
      name: "Show Sidebar Separator Controls",
      description: "Toggle visibility of separator configuration settings.",
      action: {
        type: "switch",
        value: showSeparators,
        onChange: (_value) => {
          setTimeout(() => {
            extensionAPI.settings.panel.create(buildSettingsConfig(extensionAPI));
          }, 60);
        },
      },
    },
    {
      id: "ss-show-aliases",
      name: "Show Shortcut Alias Controls",
      description: "Toggle visibility of shortcut alias settings.",
      action: {
        type: "switch",
        value: showAliases,
        onChange: (_value) => {
          setTimeout(() => {
            extensionAPI.settings.panel.create(buildSettingsConfig(extensionAPI));
          }, 60);
        },
      },
    },
  ];

  if (showAliases && shortcuts.length) {
    shortcuts.forEach((node, index) => {
      const uid = getShortcutUid(node);
      const name = getShortcutDisplayName(node);
      settings.push({
        id: uid ? `ss-alias-uid-${uid}` : `ss-alias-missing-${index}`,
        name: `Shortcut ${index + 1} alias`,
        description: name
          ? `Current shortcut: ${name}. Leave blank to keep the original shortcut name.`
          : "Current shortcut name unavailable. Leave blank to keep the original shortcut name.",
        action: {
          type: "input",
          placeholder: name || "Leave blank to keep default",
          onChange: (evt) => updateAlias(extensionAPI, uid, evt),
        },
      });

    });
  }

  if (showSeparators) {
    settings.push({
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
            console.warn("[sidebar-separators] Failed to persist count", e);
          }
          createSeparators();
          extensionAPI.settings.panel.create(buildSettingsConfig(extensionAPI));
        },
      },
    });

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
        name: `${labelPrefix} Separator label override`,
        description:
        'Optional text shown when style is set to "Label".',
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
  }

  return {
    tabTitle: "Sidebar Separators & Aliases",
    settings,
  };
}

function updateAlias(extensionAPI, uid, evt) {
  const raw = evt?.target?.value ?? evt ?? "";
  const trimmed = String(raw).trim();

  if (uid) {
    aliasOverridesByUid[uid] = trimmed || "";
    try {
      extensionAPI.settings.set(`ss-alias-uid-${uid}`, trimmed || "");
    } catch (e) {
      console.warn("[sidebar-separators] Failed to persist alias", e);
    }
  }

  createSeparators();
  scheduleSettingsRefresh(extensionAPI);
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

    extensionAPI.settings.panel.create(buildSettingsConfig(extensionAPI));
    observeShortcuts(extensionAPI);

    createSeparators();
  },

  onunload: () => {
    if (shortcutsObserver) shortcutsObserver.disconnect();
    if (shortcutsParentObserver) shortcutsParentObserver.disconnect();
    if (settingsRefreshTimer) clearTimeout(settingsRefreshTimer);
    if (shortcutsUpdateTimer) clearTimeout(shortcutsUpdateTimer);
    clearShortcutAliases();
    clearSeparators();
  },
};
