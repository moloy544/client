"use client";

import { useEffect, useRef } from "react";
import { appConfig } from "@/config/config";
import { useDispatch } from "react-redux";
import { updatefullWebAccessState } from "@/context/fullWebAccessState/fullWebAccessSlice";

export default function TopSlideNotice() {
    const dispatch = useDispatch();
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const fetchGeoInfo = async () => {
            try {

                const alreadyChecked = sessionStorage.getItem("x9_user_tkn_check");
                if (alreadyChecked) {
                    const isRestricted = alreadyChecked === 'true';
                    dispatch(updatefullWebAccessState({ isUserRestricted: isRestricted }));
                    console.log("Check already done, skipping fetch.");
                    return;
                };
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: true }));

                const response = await fetch(`${appConfig.backendUrl}/api/v1/user/get_geo`, {
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
                sessionStorage.setItem("x9_user_tkn_check", isRestricted ? "true" : "false");

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
