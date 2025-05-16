import { findMostSimilarUrl } from "./similarityAlgo.js";

const urlDict = {
    "portfolio. resume. cv.": "https://arenkdesai.github.io/ArenWebsite/portfolio",
    "table of contents. all projects. work.": "https://arenkdesai.github.io/ArenWebsite",
    "boat. graphics. sea. water.": "https://arenkdesai.github.io/ArenWebsite/boat",
    "coursework. school. classes.": "https://arenkdesai.github.io/ArenWebsite/coursework",
    "data science. analysis. professional. machine learning. artificial intelligence.": "https://arenkdesai.github.io/ArenWebsite/datascience",
    "point sprites. graphics. particles.": "https://arenkdesai.github.io/ArenWebsite/pointspritetutorial",
    "robotics. hardware. CAN VESC.": "https://arenkdesai.github.io/ArenWebsite/wroversoftware"
}

export function createWebsiteOverlay(defaultUrl) {
  // Check if there's already an input dialog to prevent duplicates
  if (document.getElementById('url-input-dialog')) {
    return;
  }
  
  // Create a small, subtle input dialog
  const inputDialog = document.createElement('div');
  inputDialog.id = 'url-input-dialog';
  inputDialog.style.position = 'fixed';
  inputDialog.style.top = '30%';
  inputDialog.style.left = '50%';
  inputDialog.style.transform = 'translate(-50%, -50%)';
  inputDialog.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  inputDialog.style.padding = '15px';
  inputDialog.style.borderRadius = '8px';
  inputDialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  inputDialog.style.zIndex = '1000';
  inputDialog.style.minWidth = '300px';
  inputDialog.style.maxWidth = '400px';
  
  // Create form for input
  const form = document.createElement('form');
  
  // Simple label
  const label = document.createElement('div');
  // label.textContent = 'What are you looking for?';
  label.style.marginBottom = '10px';
  label.style.fontSize = '14px';
  label.style.color = '#555';
  
  // URL input field
  const input = document.createElement('input');
  input.type = 'text';
  input.value = defaultUrl || '';
  input.placeholder = "show me aren's table of contents";
  input.style.width = '100%';
  input.style.padding = '8px';
  input.style.marginBottom = '10px';
  input.style.border = '1px solid #ddd';
  input.style.borderRadius = '4px';
  input.style.fontSize = '14px';
  input.style.boxSizing = 'border-box';
  
  // Button container for layout
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.gap = '8px';
  
  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Open';
  submitBtn.type = 'submit';
  submitBtn.style.padding = '6px 12px';
  submitBtn.style.backgroundColor = '#4CAF50';
  submitBtn.style.color = 'white';
  submitBtn.style.border = 'none';
  submitBtn.style.borderRadius = '4px';
  submitBtn.style.cursor = 'pointer';
  submitBtn.style.fontSize = '14px';
  
  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.type = 'button';
  cancelBtn.style.padding = '6px 12px';
  cancelBtn.style.backgroundColor = '#f1f1f1';
  cancelBtn.style.color = '#333';
  cancelBtn.style.border = '1px solid #ddd';
  cancelBtn.style.borderRadius = '4px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.fontSize = '14px';
  
  // Add event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userRes = input.value.trim();

    let finalUrl = findMostSimilarUrl(userRes, Object.keys(urlDict));
    
    if (inputDialog.parentNode) {
      document.body.removeChild(inputDialog);
    }

    showWebsiteIframe(urlDict[finalUrl]);
  });
  
  // Make sure the cancel button works
  cancelBtn.addEventListener('click', () => {
    if (inputDialog.parentNode) {
      document.body.removeChild(inputDialog);
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      if (inputDialog.parentNode) {
        document.body.removeChild(inputDialog);
      }
      document.removeEventListener('keydown', escapeHandler);
    }
  });
  
  // Assemble elements
  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(submitBtn);
  
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(buttonContainer);
  
  inputDialog.appendChild(form);
  document.body.appendChild(inputDialog);
  
  // Auto-focus the input
  setTimeout(() => input.focus(), 10);
}

function showWebsiteIframe(url) {
  // Create container
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '20%';
  overlay.style.left = '10%';
  overlay.style.width = '40%';
  overlay.style.height = '60%';
  overlay.style.zIndex = '1000';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';   
  // overlay.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  overlay.style.borderRadius = '4px';
  overlay.style.overflow = 'hidden';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '6px';
  closeBtn.style.right = '6px';
  closeBtn.style.width = '24px';
  closeBtn.style.height = '24px';
  closeBtn.style.borderRadius = '10%';
  closeBtn.style.backgroundColor = '#f1f1f1';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '18px';
  closeBtn.style.lineHeight = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.zIndex = '1001';
  
  closeBtn.addEventListener('click', () => {
    if (overlay.parentNode) {
      document.body.removeChild(overlay);
    }
  });
  
  // Add elements
  overlay.appendChild(iframe);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
  
  // Close on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
      }
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}