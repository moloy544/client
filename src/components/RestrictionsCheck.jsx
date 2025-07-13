"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updatefullWebAccessState } from "@/context/fullWebAccessState/fullWebAccessSlice";
import { safeSessionStorage } from "@/utils/errorHandlers";
import { isNotHuman } from "@/utils";
import axios from "axios";
import { isValidIp } from "@/helper/helper";

// Get current IST time
const getCurrentISTTime = () => {
    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    return new Date(currentDate.getTime() + utcOffset + istOffset);
};

export default function RestrictionsCheck({ isRestricted = false, urgentCheck = false }) {
    const dispatch = useDispatch();
    const didRun = useRef(false);

    useEffect(() => {

        if (didRun.current || isNotHuman()) return;
        didRun.current = true;

        const fetchUserIp = async () => {

            //Check if IP already saved in session
            const localSavedIp = safeSessionStorage.get("mb-uip")

            if (localSavedIp && isValidIp(localSavedIp)) {
                //Use cached IP → avoid network call
                dispatch(updatefullWebAccessState({ userRealIp: localSavedIp }));
                return;
            }

            // No IP saved → call Worker
            const res = await axios.get('https://uip.moviesbazarorg.workers.dev/');
            const ip = res.headers['x-user-ip'];

            if (res.status === 200 && ip) {
                // Save to Redux and session
                dispatch(updatefullWebAccessState({ userRealIp: ip }));
                safeSessionStorage.set("mb-uip", ip);
            }

            return;
        };

        const fetchGeoInfo = async () => {
            try {

                const isAlredyRestrictedCheck = safeSessionStorage.get("x9_user_tkn_check");
                if (isAlredyRestrictedCheck) {
                    return;
                }

                //Case: IS restricted → skip IP fetch, call backend only
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: true }));

                const response = await fetch(`https://geo-check.moviesbazarorg.workers.dev/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    dispatch(updatefullWebAccessState({ UserRestrictedChecking: false, isUserRestricted: false }));
                    return;
                }

                const data = await response.json();
                const isRestrictedFromAPI = data?.isRestricted || false;
                const geo = data?.ip;

                safeSessionStorage.set("x9_user_tkn_check", JSON.stringify({ isRestricted: isRestrictedFromAPI, geo }));

                dispatch(updatefullWebAccessState({
                    isUserRestricted: isRestrictedFromAPI,
                    userRealIp: geo,
                }));

            } catch (err) {
                console.error("Geo check failed:", err);
            } finally {
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: false }));
            }
        };

        if (!isRestricted) {
            fetchUserIp();
        } else {

            const currentISTTime = getCurrentISTTime();
            const currentHour = currentISTTime.getHours();
            // Only run during 7 AM – 8 PM IST or if urgentCheck is true
            if ((currentHour >= 7 && currentHour < 20) || urgentCheck) {
                fetchGeoInfo();
            };
        };

    }, [dispatch, isRestricted, urgentCheck]);

    return null;
}
