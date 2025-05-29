
export function isIOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
};

export function isAndroid() {
    return /android/i.test(navigator.userAgent);
};

export function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export function removeScrollbarHidden() {
    const body = document.querySelector('body');

    if (body.classList.contains('scrollbar-hidden')) {
      body.classList.remove('scrollbar-hidden');
      body.style.overflow = '';
  }

};

// Email us for any query
export const handleEmailUs = () => {
    const email = 'moviesbazarorg@gmail.com';
    window.location.href = `mailto:${email}`;
};

export async function captureScreen() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const bitmap = await imageCapture.grabFrame();

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

    // Convert to PNG and download
    const imgURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgURL;
    link.download = "screenshot.png";
    link.click();

    // Stop the screen capture
    track.stop();
  } catch (err) {
    console.error("Error capturing screen:", err);
  }
}