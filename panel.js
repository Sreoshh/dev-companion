
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

document.getElementById("inspectBtn").onclick = () => {
  chrome.devtools.inspectedWindow.eval(
    `(() => {
      const el = $0;
      if (!el) return null;

      const styles = window.getComputedStyle(el);
      const result = {};
      ${EDITABLE_PROPS.map(p => `result["${p}"] = styles.getPropertyValue("${p}");`).join("")}
      return result;
    })()`,
    (result, isException) => {
      if (isException || !result) {
        stylesDiv.innerHTML = "<p>Select an element first</p>";
        return;
      }

      renderStyles(result);
    }
  );
};

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

function applyStyle(prop, value) {
  chrome.devtools.inspectedWindow.eval(
    `(() => {
      const el = $0;
      if (!el) return;

      let styleTag = document.getElementById("__dev_companion_styles__");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "__dev_companion_styles__";
        document.head.appendChild(styleTag);
      }

      const selector = el.tagName.toLowerCase() +
        (el.className ? "." + el.className.split(" ").join(".") : "");

      styleTag.textContent = \`
        \${selector} {
          \${prop}: \${value};
        }
      \`;
    })()`
  );
}


document.getElementById("captureBtn").onclick = () => {
  output.textContent = "Component extraction coming";
};
