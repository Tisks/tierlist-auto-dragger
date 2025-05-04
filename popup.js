// =============================================
// CONTENT SCRIPT FUNCTIONS
// =============================================
function setupTierRows() {
  const tierContainer = document.getElementById("tier-container");
  if (!tierContainer) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "Tier container not found",
      level: "error",
    });
    return false;
  }

  const tierRows = tierContainer.getElementsByClassName("tier-row");
  if (tierRows.length === 0) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "No tier rows found",
      level: "error",
    });
    return false;
  }

  let allProcessed = true;
  const collectedIds = [];

  for (const row of tierRows) {
    const labelHolder = row.getElementsByClassName("label-holder")[0];
    if (!labelHolder) {
      allProcessed = false;
      continue;
    }

    const span = labelHolder.getElementsByTagName("span")[0];
    if (!span) {
      allProcessed = false;
      continue;
    }

    const id = span.textContent.trim();
    if (!id) {
      allProcessed = false;
      continue;
    }

    const tierSort = row.getElementsByClassName("tier sort")[0];
    if (!tierSort) {
      allProcessed = false;
      continue;
    }

    tierSort.id = id;
    collectedIds.push(id);
  }

  if (allProcessed) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "Tier rows processed successfully",
      data: { collectedIds },
    });
    return collectedIds;
  }
  return false;
}

function setupImageIds() {
  chrome.runtime.sendMessage({
    type: "LOG",
    message: "IM INSIDE",
    level: "error",
  });
  const idCarousel = document.getElementById("create-image-carousel");

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "I FOUND IT",
    data: { idCarousel },
  });

  if (!idCarousel) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "Image carousel not found",
      level: "error",
    });
    return false;
  }

  let imageIds = idCarousel.getElementsByTagName("div");
  imageIds = Array.from(imageIds).filter((div) => !!div.id);
  if (imageIds.length === 0) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "No image ids found",
      level: "error",
    });
    return false;
  }
  let idSpan;
  for (const id of imageIds) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "I FOUND IT",
      data: { id },
    });
    idSpan = document.createElement("span");
    idSpan.textContent = id.id;
    idSpan.style.cssText = `
      position: relative;
      z-index: 9999;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
    `;
    id.appendChild(idSpan);

    chrome.runtime.sendMessage({
      type: "LOG",
      message: "I FOUND IT",
      data: { idSpan },
    });
  }

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Image ids added successfully",
    data: { collectedIds },
  });
}

function dragItem(itemId, categoryId) {
  const item = document.getElementById(itemId);
  const category = document.getElementById(categoryId);
  const carousel = document.getElementById("char-tier-container-scroll");

  if (!item) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: `Item with ID "${itemId}" not found`,
      level: "error",
    });
    return;
  }

  if (!category) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: `Category with ID "${categoryId}" not found`,
      level: "error",
    });
    return;
  }

  if (!carousel) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "Image carousel not found",
      level: "error",
    });
    return;
  }

  // Clone the item to avoid removing it from its original location
  const clonedItem = item.cloneNode(true);
  category.appendChild(clonedItem);

  // Remove the original item from the carousel
  if (carousel.contains(item)) {
    item.remove();
  }

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Item dragged successfully",
    data: { itemId, categoryId },
  });
}

// Image handler functionality
function setupImageHandlers() {
  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Setting up image click handlers...",
  });

  const carousel = document.getElementById("create-image-carousel");
  if (!carousel) {
    chrome.runtime.sendMessage({
      type: "LOG",
      message: "Image carousel not found",
      level: "error",
    });
    return;
  }

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Image carousel found",
    data: { carousel },
  });

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

    chrome.runtime.sendMessage({
      type: "LOG",
      message: "ID shown for image",
      data: { id: div.id },
    });
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

    chrome.runtime.sendMessage({
      type: "LOG",
      message: "Image restored",
      data: { id: div.id },
    });
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

// =============================================
// POPUP FUNCTIONALITY
// =============================================
async function handleSetup(
  setupButton,
  setupComplete,
  categorySelect,
  categoryGroup
) {
  // Get the active tab
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Setup button clicked",
    data: { tab },
  });

  // Execute the setup operation in the content script
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setupTierRows,
  });

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Im about to set up image ids, wait for me",
    data: { tab },
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setupImageIds,
  });

  if (result[0].result) {
    // Hide setup button and show setup complete text
    setupButton.style.display = "none";
    setupComplete.style.display = "inline";

    // Clear existing options except the default one
    while (categorySelect.options.length > 1) {
      categorySelect.remove(1);
    }

    // Add the collected IDs as options
    result[0].result.forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      categorySelect.appendChild(option);
    });

    // Show the category select
    categoryGroup.style.display = "flex";

    // Notify background script of setup completion
    chrome.runtime.sendMessage({
      type: "SETUP_COMPLETE",
      tierRows: result[0].result,
    });
  }
}

async function handleDrag(itemInput, categorySelect) {
  const itemId = itemInput.value.trim();
  const categoryId = categorySelect.value;

  if (!itemId || !categoryId) {
    alert("Please fill in both fields");
    return;
  }

  // Get the active tab
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "Drag operation initiated",
    data: { itemId, categoryId, tab },
  });

  // Execute the drag operation in the content script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: dragItem,
    args: [itemId, categoryId],
  });

  // Clear the item input after successful drag
  itemInput.value = "";
  // Reset the select to the default option
  categorySelect.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const itemInput = document.getElementById("item");
  const categorySelect = document.getElementById("category");
  const categoryGroup = document.getElementById("category-group");
  const closeButton = document.getElementById("close");
  const dragButton = document.getElementById("drag");
  const setupButton = document.getElementById("setup");
  const setupComplete = document.getElementById("setup-complete");

  chrome.runtime.sendMessage({
    type: "LOG",
    message: "DOM Elements initialized",
    data: {
      itemInput,
      categorySelect,
      categoryGroup,
      closeButton,
      dragButton,
      setupButton,
      setupComplete,
    },
  });

  // Set up event listeners
  closeButton.addEventListener("click", () => {
    window.close();
  });

  setupButton.addEventListener("click", () =>
    handleSetup(setupButton, setupComplete, categorySelect, categoryGroup)
  );
  dragButton.addEventListener("click", () =>
    handleDrag(itemInput, categorySelect)
  );
});
