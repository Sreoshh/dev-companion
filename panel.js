
const output = document.getElementById("output");

document.getElementById("inspectBtn").onclick = () => {
  chrome.devtools.inspectedWindow.eval(
    `(() => {
      const el = $0;
      if (!el) return "No element selected";
      const styles = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        color: styles.color,
        fontSize: styles.fontSize
      };
    })()`,
    (result, isException) => {
      output.textContent = isException
        ? "Error inspecting element"
        : JSON.stringify(result, null, 2);
    }
  );
};

document.getElementById("captureBtn").onclick = () => {
  output.textContent = "Component extraction coming next…";
};
