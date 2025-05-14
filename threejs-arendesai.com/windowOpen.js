export function createWebsiteOverlay(url) {
  // Create container
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  // overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'flex';
  overlay.style.top = '20%';
  overlay.style.left = '10%';
//   overlay.style.justifyContent = 'center';
//   overlay.style.alignItems = 'center';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '40%';
  iframe.style.height = '60%';
  iframe.style.border = 'none';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '1%';
  closeBtn.style.left = '1%';
  closeBtn.style.padding = '8px 16px';
  closeBtn.style.cursor = 'pointer';
  
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  // Add elements
  overlay.appendChild(iframe);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
}