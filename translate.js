let currentStream = null;
let currentFacingMode = 'user';

window.onload = function() {
  
  const video = document.getElementById('videoElement');
  const errorMessage = document.getElementById('errorMessage');
  const flipBtn = document.getElementById('flipBtn'); 

  function initCamera(facingMode) {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = { video: { facingMode: facingMode } };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          currentStream = stream;
          video.srcObject = stream;
          video.style.display = 'block';
          errorMessage.style.display = 'none';
        })
        .catch((err) => {
          console.error('An error occurred: ' + err);
          video.style.display = 'none';
          errorMessage.style.display = 'block';
          
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage.textContent = 'Camera access was denied.';
          } else {
            errorMessage.textContent = 'An error occurred while accessing the camera.';
          }
        });
    }
  }

  // Start the camera
  initCamera(currentFacingMode);

  // Flip button listener
  if (flipBtn) {
    flipBtn.onclick = () => {
      currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
      initCamera(currentFacingMode);
    };
  }



  let deferredPrompt;
  const popup = document.getElementById('install-popup');
  const installBtn = document.getElementById('popup-install-btn');
  const closeBtn = document.getElementById('popup-close');

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      if (isMobile && !localStorage.getItem('pwa_dismissed')) {
          if (popup) popup.style.display = 'flex';
      }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User choice: ${outcome}`);
            deferredPrompt = null;
            if (popup) popup.style.display = 'none'; 
        }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (popup) popup.style.display = 'none';
        localStorage.setItem('pwa_dismissed', 'true');
    });
  }
};