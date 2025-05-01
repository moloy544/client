"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { appConfig } from "@/config/config";
import { updatefullWebAccessState } from "@/context/fullWebAccessState/fullWebAccessSlice";
import { safeSessionStorage } from "@/utils/errorHandlers";
import { isNotHuman } from "@/utils";

export default function RestrictionsCheck() {
    const dispatch = useDispatch();
    const didRun = useRef(false);

    useEffect(() => {
        if (isNotHuman() || didRun.current) return;
        didRun.current = true;

        //Get current IST time accurately
        const nowUTC = new Date();
        const istTime = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);
        const hourIST = istTime.getHours();

        //Allow API call only between 7 AM to 8 PM IST
        if (hourIST < 7 || hourIST >= 20) {
            return;
        }

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

        fetchGeoInfo();

    }, [dispatch]);

    return null;
}
