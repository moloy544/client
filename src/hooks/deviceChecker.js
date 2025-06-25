'use client';
import { useEffect, useState } from "react";

export function useDeviceType() {
  const [device, setDevice] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform;
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const isUserAgentDataMobile = navigator.userAgentData?.mobile ?? null;

    // iOS Detection (modern + fallback for iPadOS pretending to be Mac)
    const isIPhoneOrIPod = /iphone|ipod/.test(userAgent);
    const isIPad =
      /ipad/.test(userAgent) ||
      (platform === 'MacIntel' && maxTouchPoints > 1); // iPadOS disguised as Mac

    const isIOS = isIPhoneOrIPod || isIPad;

    // Android Detection
    const isAndroid = /android/.test(userAgent);

    // Tablet Detection
    const isTablet =
      isIPad ||
      (/tablet/.test(userAgent) && !/mobile/.test(userAgent)) ||
      (isAndroid && !/mobile/.test(userAgent));

    // Mobile Detection
    const isMobile =
      typeof isUserAgentDataMobile === 'boolean'
        ? isUserAgentDataMobile
        : (isAndroid && !isTablet) || isIPhoneOrIPod;

    const isDesktop = !isMobile && !isTablet;

    setDevice({
      isIOS,
      isAndroid,
      isMobile,
      isTablet,
      isDesktop,
    });
  }, []);

  return device;
}
