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
};

export function generateSourceURL(hlsSourceDomain, originalURL, userIp) {

  if (!originalURL) return null;

  const hlsProviderDomain = new URL(hlsSourceDomain || process.env.VIDEO_SERVER_URL).hostname;
  const secondHlsProviderDomain = new URL(process.env.SECOND_VIDEO_SERVER_URL).hostname;

  // Check if the originalURL contains either hlsProviderDomain or secondHlsProviderDomain
  const isHlsProviderMatch = originalURL.includes(hlsProviderDomain);
  const isSecondHlsProviderMatch = originalURL.includes(secondHlsProviderDomain);

  // If neither domain matches, return the original URL
  if (!isHlsProviderMatch && !isSecondHlsProviderMatch && !originalURL.includes('stream2')) {
    return originalURL;
  }

  // Generate expiration timestamp
  const expirationTimestamp = Math.floor(Date.now() / 1000) + 10 * 60 * 60;

  // Replace IP segment in the originalURL with expiration timestamp and user IP
  let modifiedURL = originalURL.replace(/:\d+:\d+\.\d+\.\d+\.\d+:/, `:${expirationTimestamp}:${userIp}:`);

  modifiedURL = modifiedURL.includes('.m3u8') ? modifiedURL : `${modifiedURL}.m3u8`;

  return modifiedURL;
};


export function generateCountrySpecificIp() {
  const countryRanges = [
    {
      country: 'India & Nepal', weight: 30, ranges: [
        ['49.32.0.0', '49.63.255.255'], // India
        ['103.0.0.0', '103.255.255.255'], // India all
        ['202.51.64.0', '202.51.95.255'] // Nepal
      ]
    },

    {
      country: 'Pakistan & Bangladesh', weight: 25, ranges: [
        ['39.32.0.0', '39.63.255.255'], // Pakistan
        ['103.48.16.0', '103.48.23.255'] // Bangladesh
      ]
    },

    {
      country: 'North America', weight: 30, ranges: [
        ['3.0.0.0', '3.255.255.255'], // USA
        ['24.48.0.0', '24.48.255.255'] // Canada
      ]
    },

    {
      country: 'Middle East', weight: 20, ranges: [
        ['94.200.0.0', '94.200.255.255'], // UAE
        ['188.48.0.0', '188.55.255.255'] // Saudi Arabia
      ]
    },

    {
      country: 'Europe', weight: 15, ranges: [
        ['2.0.0.0', '2.15.255.255'], // France
        ['51.140.0.0', '51.143.255.255'] // UK
      ]
    }
  ];

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
  }

  function intToIp(int) {
    return [(int >>> 24), (int >> 16 & 255), (int >> 8 & 255), (int & 255)].join('.');
  }

  function getRandomIpFromRange(range) {
    const [start, end] = range.map(ipToInt);
    const randomInt = start + Math.floor(Math.random() * (end - start + 1));
    return intToIp(randomInt);
  }

  // Weighted random country selection
  const totalWeight = countryRanges.reduce((sum, country) => sum + country.weight, 0);
  let randomWeight = Math.random() * totalWeight;
  let selectedCountry = countryRanges[0];

  for (const country of countryRanges) {
    if (randomWeight < country.weight) {
      selectedCountry = country;
      break;
    }
    randomWeight -= country.weight;
  }

  // Select random IP range from the selected country
  const randomRange = selectedCountry.ranges[Math.floor(Math.random() * selectedCountry.ranges.length)];
  const randomIp = getRandomIpFromRange(randomRange);

  return randomIp;
};


export function isValidIp(ip) {
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;
  return ipRegex.test(ip);
};