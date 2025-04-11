"use client";

import { useEffect, useRef } from "react";
import { appConfig } from "@/config/config";
import { useDispatch } from "react-redux";
import { updatefullWebAccessState } from "@/context/fullWebAccessState/fullWebAccessSlice";
import { safeSessionStorage } from "@/utils/errorHandlers";
import { isNotHuman } from "@/utils";

export default function RestrictionsCheck() {
    
    const dispatch = useDispatch();
    const didRun = useRef(false);

    useEffect(() => {

        if (isNotHuman() || didRun.current) return;
        didRun.current = true;

        const fetchGeoInfo = async () => {
            try {

                const alreadyChecked = safeSessionStorage.get("x9_user_tkn_check");
                if (alreadyChecked) {
                    const isRestricted = alreadyChecked === 'true';
                    dispatch(updatefullWebAccessState({ isUserRestricted: isRestricted }));
                    return;
                };
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: true }));

                const response = await fetch(`${appConfig.backendUrl}/api/v1/user/restrictionsCheck`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ check: 'true' }),
                });

                if (!response.ok) {
                    dispatch(updatefullWebAccessState({ UserRestrictedChecking: false, isUserRestricted: false }));
                    return;
                };

                const data = await response.json();
                const isRestricted = typeof data?.isRestricted === "boolean" ? data.isRestricted : false;

                dispatch(updatefullWebAccessState({ isUserRestricted: isRestricted }));

                // Mark as checked
               safeSessionStorage.set("x9_user_tkn_check", isRestricted ? "true" : "false");

            } catch (error) {
                console.error("Geo check failed:", error);
            } finally{
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: false }));
            }
        };
        
            fetchGeoInfo();

    }, [dispatch]);

    return null;
}
