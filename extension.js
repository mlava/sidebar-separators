var ss1, ss1L, ss1A, ss1W, ss1C, ss2, ss2L, ss2A, ss2W, ss2C, ss3, ss3L, ss3A, ss3W, ss3C, ss4, ss4L, ss4A, ss4W, ss4C, ss5, ss5L, ss5A, ss5W, ss5C = undefined;

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
                    id: "ss-1A",
                    name: "First Separator alignment",
                    description: "Align separator",
                    action: { type: "select", items: ["center", "left", "right"], onChange: (evt) => { setSS(evt, 13); } },
                },
                {
                    id: "ss-1W",
                    name: "First Separator width",
                    description: "Width as integer %",
                    action: { type: "input", placeholder: "60", onChange: (evt) => { setSS(evt, 11); } },
                },
                {
                    id: "ss-1C",
                    name: "First Separator colour",
                    description: "Colour as HEX (https://www.color-hex.com/)",
                    action: { type: "input", placeholder: "#999999", onChange: (evt) => { setSS(evt, 12); } },
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
                    id: "ss-2A",
                    name: "Second Separator alignment",
                    description: "Align separator",
                    action: { type: "select", items: ["center", "left", "right"], onChange: (evt) => { setSS(evt, 16); } },
                },
                {
                    id: "ss-2W",
                    name: "Second Separator width",
                    description: "Width as integer %",
                    action: { type: "input", placeholder: "60", onChange: (evt) => { setSS(evt, 14); } },
                },
                {
                    id: "ss-2C",
                    name: "Second Separator colour",
                    description: "Colour as HEX (https://www.color-hex.com/)",
                    action: { type: "input", placeholder: "#999999", onChange: (evt) => { setSS(evt, 15); } },
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
                {
                    id: "ss-3A",
                    name: "Third Separator alignment",
                    description: "Align separator",
                    action: { type: "select", items: ["center", "left", "right"], onChange: (evt) => { setSS(evt, 19); } },
                },
                {
                    id: "ss-3W",
                    name: "Third Separator width",
                    description: "Width as integer %",
                    action: { type: "input", placeholder: "60", onChange: (evt) => { setSS(evt, 17); } },
                },
                {
                    id: "ss-3C",
                    name: "Third Separator colour",
                    description: "Colour as HEX (https://www.color-hex.com/)",
                    action: { type: "input", placeholder: "#999999", onChange: (evt) => { setSS(evt, 18); } },
                },
                {
                    id: "ss-4",
                    name: "Fourth Separator Style",
                    description: "Preference for fourth separator",
                    action: { type: "select", items: ["Horizontal Line", "Blank Space"], onChange: (evt) => { setSS(evt, 7); } },
                },
                {
                    id: "ss-4L",
                    name: "Fourth Separator location",
                    description: "Place Separator after which Shortcut (in order, integer)",
                    action: { type: "input", placeholder: "integer", onChange: (evt) => { setSS(evt, 8); } },
                },
                {
                    id: "ss-4A",
                    name: "Fourth Separator alignment",
                    description: "Align separator",
                    action: { type: "select", items: ["center", "left", "right"], onChange: (evt) => { setSS(evt, 22); } },
                },
                {
                    id: "ss-4W",
                    name: "Fourth Separator width",
                    description: "Width as integer %",
                    action: { type: "input", placeholder: "60", onChange: (evt) => { setSS(evt, 20); } },
                },
                {
                    id: "ss-4C",
                    name: "Fourth Separator colour",
                    description: "Colour as HEX (https://www.color-hex.com/)",
                    action: { type: "input", placeholder: "#999999", onChange: (evt) => { setSS(evt, 21); } },
                },
                {
                    id: "ss-5",
                    name: "Fifth Separator Style",
                    description: "Preference for fifth separator",
                    action: { type: "select", items: ["Horizontal Line", "Blank Space"], onChange: (evt) => { setSS(evt, 9); } },
                },
                {
                    id: "ss-5L",
                    name: "Fifth Separator location",
                    description: "Place Separator after which Shortcut (in order, integer)",
                    action: { type: "input", placeholder: "integer", onChange: (evt) => { setSS(evt, 10); } },
                },
                {
                    id: "ss-5A",
                    name: "Fifth Separator alignment",
                    description: "Align separator",
                    action: { type: "select", items: ["center", "left", "right"], onChange: (evt) => { setSS(evt, 25); } },
                },
                {
                    id: "ss-5W",
                    name: "Fifth Separator width",
                    description: "Width as integer %",
                    action: { type: "input", placeholder: "60", onChange: (evt) => { setSS(evt, 23); } },
                },
                {
                    id: "ss-5C",
                    name: "Fifth Separator colour",
                    description: "Colour as HEX (https://www.color-hex.com/)",
                    action: { type: "input", placeholder: "#999999", onChange: (evt) => { setSS(evt, 24); } },
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
        ss1A = extensionAPI.settings.get("ss-1A");
        if (extensionAPI.settings.get("ss-1W")) {
            ss1W = extensionAPI.settings.get("ss-1W");
        } else {
            ss1W = "60";
        }
        if (extensionAPI.settings.get("ss-1C")) {
            ss1C = extensionAPI.settings.get("ss-1C");
        } else {
            ss1C = "#999999";
        }

        if (extensionAPI.settings.get("ss-2")) {
            ss2 = extensionAPI.settings.get("ss-2");
        } else {
            ss2 = "Horizontal Line";
        }
        ss2L = extensionAPI.settings.get("ss-2L");
        ss2A = extensionAPI.settings.get("ss-2A");
        if (extensionAPI.settings.get("ss-2W")) {
            ss2W = extensionAPI.settings.get("ss-2W");
        } else {
            ss2W = "60";
        }
        if (extensionAPI.settings.get("ss-2C")) {
            ss2C = extensionAPI.settings.get("ss-2C");
        } else {
            ss2C = "#999999";
        }

        if (extensionAPI.settings.get("ss-3")) {
            ss3 = extensionAPI.settings.get("ss-3");
        } else {
            ss3 = "Horizontal Line";
        }
        ss3L = extensionAPI.settings.get("ss-3L");
        ss3A = extensionAPI.settings.get("ss-3A");
        if (extensionAPI.settings.get("ss-3W")) {
            ss3W = extensionAPI.settings.get("ss-3W");
        } else {
            ss3W = "60";
        }
        if (extensionAPI.settings.get("ss-3C")) {
            ss3C = extensionAPI.settings.get("ss-3C");
        } else {
            ss3C = "#999999";
        }

        if (extensionAPI.settings.get("ss-4")) {
            ss4 = extensionAPI.settings.get("ss-4");
        } else {
            ss4 = "Horizontal Line";
        }
        ss4L = extensionAPI.settings.get("ss-4L");
        ss4A = extensionAPI.settings.get("ss-4A");
        if (extensionAPI.settings.get("ss-4W")) {
            ss4W = extensionAPI.settings.get("ss-4W");
        } else {
            ss4W = "60";
        }
        if (extensionAPI.settings.get("ss-4C")) {
            ss4C = extensionAPI.settings.get("ss-4C");
        } else {
            ss4C = "#999999";
        }

        if (extensionAPI.settings.get("ss-5")) {
            ss5 = extensionAPI.settings.get("ss-5");
        } else {
            ss5 = "Horizontal Line";
        }
        ss5L = extensionAPI.settings.get("ss-5L");
        ss5A = extensionAPI.settings.get("ss-5A");
        if (extensionAPI.settings.get("ss-5W")) {
            ss5W = extensionAPI.settings.get("ss-5W");
        } else {
            ss5W = "60";
        }
        if (extensionAPI.settings.get("ss-5C")) {
            ss5C = extensionAPI.settings.get("ss-5C");
        } else {
            ss5C = "#999999";
        }
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
            } else if (i == 7) {
                ss4 = evt;
            } else if (i == 8) {
                if (evt.target.value != "") {
                    ss4L = evt.target.value;
                } else {
                    ss4L = null;
                }
            } else if (i == 9) {
                ss5 = evt;
            } else if (i == 10) {
                if (evt.target.value != "") {
                    ss5L = evt.target.value;
                } else {
                    ss5L = null;
                }
            } else if (i == 11) {
                if (evt.target.value != "") {
                    ss1W = evt.target.value;
                } else {
                    ss1W = "60";
                }
            } else if (i == 12) {
                if (evt.target.value != "") {
                    ss1C = evt.target.value;
                } else {
                    ss1C = "#999999";
                }
            } else if (i == 13) {
                ss1A = evt;
            } else if (i == 14) {
                if (evt.target.value != "") {
                    ss2W = evt.target.value;
                } else {
                    ss2W = "60";
                }
            } else if (i == 15) {
                if (evt.target.value != "") {
                    ss2C = evt.target.value;
                } else {
                    ss2C = "#999999";
                }
            } else if (i == 16) {
                ss2A = evt;
            } else if (i == 17) {
                if (evt.target.value != "") {
                    ss3W = evt.target.value;
                } else {
                    ss3W = "60";
                }
            } else if (i == 18) {
                if (evt.target.value != "") {
                    ss3C = evt.target.value;
                } else {
                    ss3C = "#999999";
                }
            } else if (i == 19) {
                ss3A = evt;
            } else if (i == 20) {
                if (evt.target.value != "") {
                    ss4W = evt.target.value;
                } else {
                    ss4W = "60";
                }
            } else if (i == 21) {
                if (evt.target.value != "") {
                    ss4C = evt.target.value;
                } else {
                    ss4C = "#999999";
                }
            } else if (i == 22) {
                ss4A = evt;
            } else if (i == 23) {
                if (evt.target.value != "") {
                    ss5W = evt.target.value;
                } else {
                    ss5W = "60";
                }
            } else if (i == 24) {
                if (evt.target.value != "") {
                    ss5C = evt.target.value;
                } else {
                    ss5C = "#999999";
                }
            } else if (i == 25) {
                ss5A = evt;
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
        if (document.getElementById("sidebar_sep_4")) {                
            document.getElementById("sidebar_sep_4").remove();
        }
        if (document.getElementById("sidebar_sep_5")) {                
            document.getElementById("sidebar_sep_5").remove();
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
    if (document.getElementById("sidebar_sep_4")) {                
        document.getElementById("sidebar_sep_4").remove();
    }
    if (document.getElementById("sidebar_sep_5")) {                
        document.getElementById("sidebar_sep_5").remove();
    }

    if ((ss1L != undefined && ss1L != null) || (ss2L != undefined && ss2L != null) || (ss3L != undefined && ss3L != null) || (ss4L != undefined && ss4L != null) || (ss5L != undefined && ss5L != null)) {
        let shortcuts = document.querySelectorAll("div.starred-pages > a");
        let shortcutsParent = document.querySelector("div.starred-pages");

        if (ss1L != undefined && ss1L != null) {
            let hr = document.createElement('hr');
            hr.style.width = ss1W+"%";
            hr.style.border = "1px solid "+ss1C;
            hr.style.backgroundColor = ss1C;
            if (ss1A == "left") {
                hr.style.marginLeft = "5px";
            } else if (ss1A == "right") {
                hr.style.marginRight = "5px";
            }            
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
            hr.style.width = ss2W+"%";
            hr.style.border = "1px solid "+ss2C;
            hr.style.backgroundColor = ss2C;
            if (ss2A == "left") {
                hr.style.marginLeft = "5px";
            } else if (ss2A == "right") {
                hr.style.marginRight = "5px";
            }       
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
            hr.style.width = ss3W+"%";
            hr.style.border = "1px solid "+ss3C;
            hr.style.backgroundColor = ss3C;
            if (ss3A == "left") {
                hr.style.marginLeft = "5px";
            } else if (ss3A == "right") {
                hr.style.marginRight = "5px";
            }       
            hr.id = "sidebar_sep_3";
            let br = document.createElement('br');
            br.id = "sidebar_sep_3";
            if (ss3 == "Horizontal Line") {
                shortcutsParent.insertBefore(hr, shortcuts[ss3L])
            } else {
                shortcutsParent.insertBefore(br, shortcuts[ss3L])
            }
        }
        if (ss4L != undefined && ss4L != null) {
            let hr = document.createElement('hr');
            hr.style.width = ss4W+"%";
            hr.style.border = "1px solid "+ss4C;
            hr.style.backgroundColor = ss4C;
            if (ss4A == "left") {
                hr.style.marginLeft = "5px";
            } else if (ss4A == "right") {
                hr.style.marginRight = "5px";
            }       
            hr.id = "sidebar_sep_4";
            let br = document.createElement('br');
            br.id = "sidebar_sep_4";
            if (ss4 == "Horizontal Line") {
                shortcutsParent.insertBefore(hr, shortcuts[ss4L])
            } else {
                shortcutsParent.insertBefore(br, shortcuts[ss4L])
            }
        }
        if (ss5L != undefined && ss5L != null) {
            let hr = document.createElement('hr');
            hr.style.width = ss5W+"%";
            hr.style.border = "1px solid "+ss5C;
            hr.style.backgroundColor = ss5C;
            if (ss5A == "left") {
                hr.style.marginLeft = "5px";
            } else if (ss5A == "right") {
                hr.style.marginRight = "5px";
            }       
            hr.id = "sidebar_sep_5";
            let br = document.createElement('br');
            br.id = "sidebar_sep_5";
            if (ss5 == "Horizontal Line") {
                shortcutsParent.insertBefore(hr, shortcuts[ss5L])
            } else {
                shortcutsParent.insertBefore(br, shortcuts[ss5L])
            }
        }
    }
}