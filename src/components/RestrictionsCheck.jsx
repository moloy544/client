"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { appConfig } from "@/config/config";
import { updatefullWebAccessState } from "@/context/fullWebAccessState/fullWebAccessSlice";
import { safeSessionStorage } from "@/utils/errorHandlers";
import { isNotHuman } from "@/utils";

// Get current IST time
const getCurrentISTTime = () => {
    const currentDate = new Date();
    const utcOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    return new Date(currentDate.getTime() + utcOffset + istOffset);
};

export default function RestrictionsCheck({ urgentCheck = false }) {
    const dispatch = useDispatch();
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current || isNotHuman()) return;
        didRun.current = true;

        const currentISTTime = getCurrentISTTime();
        const currentHour = currentISTTime.getHours();

        const fetchGeoInfo = async () => {
            try {
                const cached = safeSessionStorage.get("x9_user_tkn_check");
                const UserRestrictedData = cached ? JSON.parse(cached) : null;

                if (UserRestrictedData?.isRestricted) {
                    dispatch(updatefullWebAccessState({
                        isUserRestricted: true,
                        userRealIp: UserRestrictedData.geo
                    }));
                    return;
                } else if (UserRestrictedData) {
                    return;
                }

                dispatch(updatefullWebAccessState({ UserRestrictedChecking: true }));

                const response = await fetch(`${appConfig.backendUrl}/api/v1/user/restrictionsCheck`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ check: "true" }),
                });

                if (!response.ok) {
                    dispatch(updatefullWebAccessState({ UserRestrictedChecking: false, isUserRestricted: false }));
                    return;
                }

                const data = await response.json();
                const isRestricted = data?.isRestricted || false;
                const geo = data?.geo;

                safeSessionStorage.set("x9_user_tkn_check", JSON.stringify({ isRestricted, geo }));

                dispatch(updatefullWebAccessState({ isUserRestricted: isRestricted, userRealIp: geo }));

            } catch (err) {
                console.error("Geo check failed:", err);
            } finally {
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: false }));
            }
        };

        // Call API only between 7:00 AM and 08:00 PM IST
        if (currentHour >= 7 && currentHour < 20) {
            fetchGeoInfo();
        } else if (urgentCheck) {
            // If urgent check is required, force the fetch regardless of time
            fetchGeoInfo();
        }

    }, [dispatch]);

    return null;
}
