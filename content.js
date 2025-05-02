// This file is intentionally left empty as the drag functionality
// is handled by the popup.js file through chrome.scripting.executeScript

// Image handler functionality
function setupImageHandlers() {
  const carousel = document.getElementById("139");
  if (!carousel) {
    console.error("Image carousel not found");
    return;
  }

  // Store original image data and clicked state
  const imageState = new Map();

  function handleImageClick(event) {
    const div = event.currentTarget;
    const id = div.id;

    // If div is already showing ID (has the custom prop)
    if (div.hasAttribute("data-shown-id")) {
      restoreImage(div);
    } else {
      showId(div);
    }
  }

  function showId(div) {
    const img = div.querySelector("img");
    if (!img) return;

    // Save original state
    const originalState = {
      src: img.src,
      width: img.width,
      height: img.height,
    };
    imageState.set(div.id, originalState);

    // Create container for ID text
    const idContainer = document.createElement("div");
    idContainer.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${originalState.width}px;
      height: ${originalState.height}px;
      background-color: rgba(0, 0, 0, 0.7);
      cursor: pointer;
    `;

    // Create ID text
    const idText = document.createElement("span");
    idText.textContent = div.id;
    idText.style.cssText = `
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    `;

    // Replace content
    idContainer.appendChild(idText);
    div.innerHTML = "";
    div.appendChild(idContainer);

    // Mark as showing ID
    div.setAttribute("data-shown-id", "true");
  }

  function restoreImage(div) {
    const originalState = imageState.get(div.id);
    if (!originalState) return;

    // Create and restore image
    const img = document.createElement("img");
    img.src = originalState.src;
    img.width = originalState.width;
    img.height = originalState.height;

    // Replace content
    div.innerHTML = "";
    div.appendChild(img);

    // Remove state
    div.removeAttribute("data-shown-id");
    imageState.delete(div.id);
  }

  // Get all divs inside the carousel
  const imageDivs = carousel.getElementsByTagName("div");

  for (const div of imageDivs) {
    // Skip if no ID or already has click handler
    if (!div.id || div.hasAttribute("data-click-handler")) continue;

    // Add click handler
    div.addEventListener("click", handleImageClick);
    div.setAttribute("data-click-handler", "true");
  }
}

// Initialize image handlers when the page loads
document.addEventListener("DOMContentLoaded", setupImageHandlers);
