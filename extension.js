var ss1, ss1L, ss2, ss2L, ss3, ss3L = undefined;

export default {
    onload: ({ extensionAPI }) => {
        const config = {
            tabTitle: "Sidebar Separators",
            settings: [
                {
                    id: "ss-1",
                    name: "First Separator Style",
                    description: "Preference for first separator",
                    action: { type: "select", items: ["Horizontal Line", "Blank Space"], onChange: (evt) => { setSS(evt, 1); } },
                },
                {
                    id: "ss-1L",
                    name: "First Separator location",
                    description: "Place Separator after which Shortcut (in order, integer)",
                    action: { type: "input", placeholder: "integer", onChange: (evt) => { setSS(evt, 2); } },
                },
                {
                    id: "ss-2",
                    name: "Second Separator Style",
                    description: "Preference for second separator",
                    action: { type: "select", items: ["Horizontal Line", "Blank Space"], onChange: (evt) => { setSS(evt, 3); } },
                },
                {
                    id: "ss-2L",
                    name: "Second Separator location",
                    description: "Place Separator after which Shortcut (in order, integer)",
                    action: { type: "input", placeholder: "integer", onChange: (evt) => { setSS(evt, 4); } },
                },
                {
                    id: "ss-3",
                    name: "Third Separator Style",
                    description: "Preference for third separator",
                    action: { type: "select", items: ["Horizontal Line", "Blank Space"], onChange: (evt) => { setSS(evt, 5); } },
                },
                {
                    id: "ss-3L",
                    name: "Third Separator location",
                    description: "Place Separator after which Shortcut (in order, integer)",
                    action: { type: "input", placeholder: "integer", onChange: (evt) => { setSS(evt, 6); } },
                },
            ]
        };
        extensionAPI.settings.panel.create(config);

        // onload
        if (extensionAPI.settings.get("ss-1")) {
            ss1 = extensionAPI.settings.get("ss-1");
        } else {
            ss1 = "Horizontal Line";
        }
        ss1L = extensionAPI.settings.get("ss-1L");
        if (extensionAPI.settings.get("ss-2")) {
            ss2 = extensionAPI.settings.get("ss-2");
        } else {
            ss2 = "Horizontal Line";
        }
        ss2L = extensionAPI.settings.get("ss-2L");
        if (extensionAPI.settings.get("ss-3")) {
            ss3 = extensionAPI.settings.get("ss-3");
        } else {
            ss3 = "Horizontal Line";
        }
        ss3L = extensionAPI.settings.get("ss-3L");
        createSeparators();

        // onchange
        function setSS(evt, i) {
            if (i == 1) {
                ss1 = evt;
            } else if (i == 2) {
                if (evt.target.value != "") {
                    ss1L = evt.target.value;
                } else {
                    ss1L = null;
                }
            } else if (i == 3) {
                ss2 = evt;
            } else if (i == 4) {
                if (evt.target.value != "") {
                    ss2L = evt.target.value;
                } else {
                    ss2L = null;
                }
            } else if (i == 5) {
                ss3 = evt;
            } else if (i == 6) {
                if (evt.target.value != "") {
                    ss3L = evt.target.value;
                } else {
                    ss3L = null;
                }
            }
            createSeparators();
        }

    },
    onunload: () => {
        if (document.getElementById("sidebar_sep_1")) {                
            document.getElementById("sidebar_sep_1").remove();
        }        
        if (document.getElementById("sidebar_sep_2")) {                
            document.getElementById("sidebar_sep_2").remove();
        }        
        if (document.getElementById("sidebar_sep_3")) {                
            document.getElementById("sidebar_sep_3").remove();
        }
    }
}

function createSeparators() {
    if (document.getElementById("sidebar_sep_1")) {                
        document.getElementById("sidebar_sep_1").remove();
    }        
    if (document.getElementById("sidebar_sep_2")) {                
        document.getElementById("sidebar_sep_2").remove();
    }        
    if (document.getElementById("sidebar_sep_3")) {                
        document.getElementById("sidebar_sep_3").remove();
    }

    if ((ss1L != undefined && ss1L != null) || (ss2L != undefined && ss2L != null) || (ss3L != undefined && ss3L != null)) {
        let shortcuts = document.querySelectorAll("div.starred-pages > a");
        let shortcutsParent = document.querySelector("div.starred-pages");

        if (ss1L != undefined && ss1L != null) {
            let hr = document.createElement('hr');
            hr.style.width = "60%";
            hr.id = "sidebar_sep_1";
            let br = document.createElement('br');
            br.id = "sidebar_sep_1";
            if (ss1 == "Horizontal Line") {
                shortcutsParent.insertBefore(hr, shortcuts[ss1L])
            } else {
                shortcutsParent.insertBefore(br, shortcuts[ss1L])
            }
        }
        if (ss2L != undefined && ss2L != null) {
            let hr = document.createElement('hr');
            hr.style.width = "60%";
            hr.id = "sidebar_sep_2";
            let br = document.createElement('br');
            br.id = "sidebar_sep_2";
            if (ss2 == "Horizontal Line") {
                shortcutsParent.insertBefore(hr, shortcuts[ss2L])
            } else {
                shortcutsParent.insertBefore(br, shortcuts[ss2L])
            }
        }
        if (ss3L != undefined && ss3L != null) {
            let hr = document.createElement('hr');
            hr.style.width = "60%";
            hr.id = "sidebar_sep_3";
            let br = document.createElement('br');
            br.id = "sidebar_sep_3";
            if (ss3 == "Horizontal Line") {
                shortcutsParent.insertBefore(hr, shortcuts[ss3L])
            } else {
                shortcutsParent.insertBefore(br, shortcuts[ss3L])
            }
        }
    }
}