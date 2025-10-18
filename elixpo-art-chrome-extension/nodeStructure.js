(() => {
  let selectionLock = false;
  let typingTimeout;
  let selectedAspectRatio = "1:1";
  let selectedTheme = "Normal";
  let selectedText = "";
  let shineButton = null;
  let wrapperCreated = false;

  const themes = ["Normal", "Chromatic", "Wpap", "Landscape", "Anime", "Pixel"];
  const aspectRatios = ["1:1", "4:3", "16:9", "9:16"];

  document.addEventListener("mouseup", (event) => {
    if (wrapperCreated) return;

    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    setTimeout(() => {
      if (!selectedText) {
        removeShineButton();
        selectionLock = false;
        return;
      }
    }, 200);

    if (selectionLock) return;

    if (selectedText) {
      selectionLock = true;
      removeShineButton();

      const range = selection.getRangeAt(0);
      shineButton = document.createElement("button");
      shineButton.className = "shine-button";

      const shineImage = document.createElement("img");
      shineImage.src = chrome.runtime.getURL("assets/shines_thumbnail.png");
      shineImage.alt = "Generate with Shines";

      Object.assign(shineButton.style, {
        position: "absolute",
        padding: "5px",
        height: "40px",
        width: "45px",
        zIndex: "10001",
        background: "linear-gradient(135deg, #2a0038, #4b0082)",
        border: "none",
        cursor: "pointer",
        borderRadius: "15px",
        opacity: "1",
        transition: "opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        display: "flex",
        justifyContent: "center",
        transform: "scale(0.8)",
        alignItems: "center",
        boxShadow: "inset 4px 4px 6px rgba(0, 0, 0, 0.8), inset -4px -4px 6px rgba(144, 0, 255, 0.3)"
      });

      Object.assign(shineImage.style, {
        width: "24px",
        height: "24px"
      });

      shineButton.appendChild(shineImage);
      document.body.appendChild(shineButton);

      const rect = range.getBoundingClientRect();
      const btnWidth = shineButton.offsetWidth;
      const btnHeight = shineButton.offsetHeight;
      shineButton.style.left = `${rect.left + window.scrollX - btnWidth - 10}px`;
      shineButton.style.top = `${rect.top + window.scrollY - btnHeight - 10}px`;

      shineButton.addEventListener("click", () => {
        createWrapper(range);
        removeShineButton();
      });
    } else {
      removeShineButton();
      selectionLock = false;
    }
  });

  document.addEventListener("selectionchange", () => {
    if (!window.getSelection().toString().trim()) {
      wrapperCreated = false;
      selectionLock = false;
    }
  });

  function removeShineButton() {
    const existing = document.querySelector(".shine-button");
    if (existing) existing.remove();
    shineButton = null;
  }

  function type(text) {
    const element = document.getElementById("pimpText");
    if (!element) return;
    element.textContent = "";
    let index = 0;

    cancelAnimationFrame(typingTimeout);
    function typeChar() {
      if (index < text.length) {
        element.textContent += text.char
