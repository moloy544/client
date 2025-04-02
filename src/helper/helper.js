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

