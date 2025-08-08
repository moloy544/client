import { partnerIntegration } from "@/config/ads.config";
import { safeLocalStorage } from "./errorHandlers";
import { handleEmailUs } from "@/helper/helper";

export const openDirectLink = (cb) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (cb && typeof cb === 'function') cb();
      return;
    }

    // Check user last use date and only show overlay if user is older than 1 day
    const oldUser = safeLocalStorage.get('firstUseDate');
    const now = new Date();

    if (!oldUser) {
      // First visit — save current date and don't show overlay
      safeLocalStorage.set('firstUseDate', now.toISOString());
    };
    const link = document.createElement('a');
    link.href = partnerIntegration.direct_Link;
    link.target = '_blank';
    link.rel = 'nofollow noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (cb && typeof cb === 'function') cb();

  } catch (error) {
    console.error('Error opening direct link:', error);
  }
};

let overlayDiv;
let timer = 5; // Countdown timer in seconds
let spentTime = 0;
let countdownInterval;
let lastPathname = null;

export const openDirectLinkWithCountdown = ({ actionTypeMessage = "steaming", callBack, preventCountdown = false }) => {

  if (process.env.NODE_ENV === 'development') {
    if (callBack && typeof callBack === 'function') callBack();
    return;
  }

  const currentPath = window.location.pathname;

  // Reset timer if user has navigated to a different page
  if (lastPathname !== currentPath) {
    timer = 5;
    spentTime = 0;
    lastPathname = currentPath;
  }

  const link = document.createElement("a");
  link.href = partnerIntegration.direct_Link;
  link.target = "_blank";
  link.rel = "nofollow noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Check user last use date and only show overlay if user is older than 1 day
  const oldUser = safeLocalStorage.get('firstUseDate');
  const now = new Date();
  const isSocialjoinAvailable = safeLocalStorage.get('social_join_alert');

  if (!oldUser) {
    // First visit — save current date and don't show overlay
    safeLocalStorage.set('firstUseDate', now.toISOString());
  };

  if (!isSocialjoinAvailable) {
    // If social join alert is available, do not show overlay
    if (callBack && typeof callBack === 'function') callBack();
    return;
  }

  const lastUse = new Date(oldUser);
  const diffInMs = now - lastUse;
  const oneDayMs = 24 * 60 * 60 * 1000;

  // User is less than 1 day old or preventCountdown true, do NOT show overlay just call the callback and return
  if ((diffInMs < oneDayMs || preventCountdown) && !isSocialjoinAvailable) {
    if (callBack && typeof callBack === 'function') callBack();
    console.log("User is less than 1 day old or preventCountdown is true, not showing overlay.");
    return;
  }

  // Show overlay for old users only
  overlayDiv = document.createElement("div");
  overlayDiv.id = "ad-overlay";
  overlayDiv.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9); color: #fff; font-size: 18px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 9999; text-align: center; padding: 0 20px;
  `;

  const updateOverlay = (showButton = false) => {
    const currentPathCheck = window.location.pathname;
    if (currentPathCheck !== lastPathname) {
      clearInterval(countdownInterval);
      if (overlayDiv && overlayDiv.parentNode) {
        document.body.removeChild(overlayDiv);
      }
      return;
    }

    const left = timer - spentTime;
    if (left <= 0) {
      overlayDiv.innerHTML = "";
      clearInterval(countdownInterval);

      if (overlayDiv && overlayDiv.parentNode) {
        document.body.removeChild(overlayDiv);
      }
      if (callBack && typeof callBack === "function") callBack();

      return;
    };

    window.handleEmailUs = handleEmailUs;

    overlayDiv.innerHTML = `
  <div class="flex flex-col items-center justify-center gap-4 px-4 text-center max-w-md">

    <!-- Top-right Report Button -->
    <button
      type="button"
      onclick="handleEmailUs()"
      class="fixed top-2 right-2 flex items-center gap-1 rounded bg-slate-600 bg-opacity-20 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 focus:outline-none"
    >
      <i class="bi bi-bug text-sm"></i> Report
    </button>

    <div class="w-20 h-20 rounded-full border-4 border-yellow-500 flex items-center justify-center bg-white shadow-lg">
      <i class="bi bi-hourglass-split text-3xl text-yellow-600"></i>
    </div>

    <p class="text-lg sm:text-base font-medium text-white">
      You have stayed on the ad tab for <span class="text-yellow-400 font-bold">${spentTime} seconds</span>.<br>
      Please wait <span class="text-yellow-400 font-bold">${left} seconds</span> more to continue.
    </p>

    <p class="text-sm text-red-400">
      If you closed the ad, click the button below.<br>
      Open it for just 10 seconds to enjoy free ${actionTypeMessage}.
    </p>

    ${showButton ? `<button id="revisit-ad" style="
      margin-top: 15px; padding: 10px 20px; font-size: 16px;
      background: #ff4500; border: none; color: white; border-radius: 5px;
      cursor: pointer;
    ">Open Ad Again</button>` : ""}
  </div>
`;

    if (showButton) {
      const revisitBtn = document.getElementById("revisit-ad");
      if (revisitBtn) {
        revisitBtn.onclick = () => {
          const newLink = document.createElement("a");
          newLink.href = partnerIntegration.direct_Link;
          newLink.target = "_blank";
          newLink.rel = "nofollow noopener noreferrer";

          document.body.appendChild(newLink);
          newLink.click();
          document.body.removeChild(newLink);
        };
      }
    }
  };

  document.body.appendChild(overlayDiv);
  updateOverlay(false);

  let tabIsActive = true;

  const handleVisibilityChange = () => {
    tabIsActive = !document.hidden;
    if (tabIsActive && spentTime < timer) {
      updateOverlay(true);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  countdownInterval = setInterval(() => {
    if (window.location.pathname !== lastPathname) {
      clearInterval(countdownInterval);
      if (overlayDiv && overlayDiv.parentNode) {
        document.body.removeChild(overlayDiv);
      }
      return;
    }

    if (!tabIsActive) {
      spentTime++;
      updateOverlay(false);
    }
  }, 1000);
};


export const runPopunder = (delay) => {
  const scriptId = partnerIntegration.popunderScript.id;
  if (process.env.NODE_ENV === 'development' || document.getElementById(scriptId)) {
    return;
  }

  if (delay) {
    setTimeout(() => {
      loadPopunderScript(scriptId);
    }, delay);
  } else {
    loadPopunderScript(scriptId);
  }

  function loadPopunderScript() {
    const partnerIntegrationScript = document.createElement("script");
    partnerIntegrationScript.id = scriptId;
    partnerIntegrationScript.src = partnerIntegration.popunderScript.src;
    partnerIntegrationScript.async = true;
    partnerIntegrationScript.type = "text/javascript";
    document.body.appendChild(partnerIntegrationScript);
  };
};
