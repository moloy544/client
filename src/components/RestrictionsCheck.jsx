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

                const UserRestrictedData = safeSessionStorage.get("x9_user_tkn_check") ? JSON.parse(safeSessionStorage.get("x9_user_tkn_check")) : null;
                const alreadyChecked = UserRestrictedData?.isRestricted ? UserRestrictedData.isRestricted : false;
                if (alreadyChecked) {
                    const dataToSaveInState = { isUserRestricted: UserRestrictedData.isRestricted };
                    if (UserRestrictedData.geo) {
                        dataToSaveInState.userRealIp = UserRestrictedData.geo;
                    }
                    dispatch(updatefullWebAccessState(dataToSaveInState));
                    return;
                } else if (UserRestrictedData) {
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

                const userIp = data.geo;

                const dataToSave = {
                    isRestricted: isRestricted,
                };

                if (userIp) {
                    dataToSave.geo = userIp;
                };

                const dataToSaveInState = { isUserRestricted: isRestricted, userRealIp: userIp };

                dispatch(updatefullWebAccessState(dataToSaveInState));

                // Save the data in session storage
                safeSessionStorage.set("x9_user_tkn_check", JSON.stringify(dataToSave));

            } catch (error) {
                console.error("Geo check failed:", error);
            } finally {
                dispatch(updatefullWebAccessState({ UserRestrictedChecking: false }));
            }
        };

        fetchGeoInfo();

    }, [dispatch]);

    return null;
}
