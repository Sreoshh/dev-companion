let currentSelector = null;
let appliedStyles = {};

const output = document.getElementById("output");
const stylesDiv = document.getElementById("styles");

const EDITABLE_PROPS = [
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "padding",
  "margin",
  "border-radius"
];

// Inspect selected element
document.getElementById("inspectBtn").onclick = () => {
  chrome.devtools.inspectedWindow.eval(
    `(() => {
      const el = $0;
      if (!el) return null;

      const styles = window.getComputedStyle(el);
      const resultStyles = {};

      ${EDITABLE_PROPS.map(
        prop => `resultStyles["${prop}"] = styles.getPropertyValue("${prop}");`
      ).join("\n")}

      return {
        selector: (${getUniqueSelector()}),
        styles: resultStyles
      };
    })()`,
    (result, isException) => {
      if (isException || !result) {
        stylesDiv.innerHTML = "<p>Select an element first</p>";
        return;
      }

      currentSelector = result.selector;
      appliedStyles = {};

      renderStyles(result.styles);
    }
  );
};

// Render editable style inputs
function renderStyles(styleObj) {
  stylesDiv.innerHTML = "";

  Object.entries(styleObj).forEach(([prop, value]) => {
    const row = document.createElement("div");
    row.className = "style-row";

    const label = document.createElement("label");
    label.textContent = prop;

    const input = document.createElement("input");
    input.value = value.trim();

    input.oninput = () => applyStyle(prop, input.value);

    row.append(label, input);
    stylesDiv.appendChild(row);
  });
}

// Apply live styles safely
function applyStyle(prop, value) {
  if (!currentSelector) return;

  appliedStyles[prop] = value;

  chrome.devtools.inspectedWindow.eval(
    `(() => {
      let styleTag = document.getElementById("__dev_companion_styles__");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "__dev_companion_styles__";
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = \`
${currentSelector} {
${Object.entries(appliedStyles)
  .map(([k, v]) => `  ${k}: ${v};`)
  .join("\n")}
}
      \`;
    })()`
  );
}

// Generate safer unique selector
function getUniqueSelector() {
  return `(() => {
    const el = $0;
    if (!el) return null;

    if (el.id) return "#" + el.id;

    const parts = [];
    let current = el;

    while (current && current.nodeType === 1 && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.className) {
        const cls = current.className.trim().split(/\\s+/)[0];
        selector += "." + cls;
      }

      const siblingIndex =
        Array.from(current.parentNode.children).indexOf(current) + 1;

      selector += \`:nth-child(\${siblingIndex})\`;

      parts.unshift(selector);
      current = current.parentElement;
    }

    return parts.join(" > ");
  })()`;
}
// Reset styles

document.getElementById("resetBtn").onclick = () => {
  appliedStyles = {};

  chrome.devtools.inspectedWindow.eval(
    `(() => {
      const styleTag = document.getElementById("__dev_companion_styles__");
      if (styleTag) styleTag.remove();
    })()`
  );

  stylesDiv.innerHTML = "<p>Styles reset</p>";
};

// Placeholder for extraction
document.getElementById("captureBtn").onclick = () => {
  output.textContent = "Component extraction coming";
};
