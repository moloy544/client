"use client";

import { isNotHuman } from '@/utils';
import { useEffect } from 'react';


export default function RestrictionsCheck({ userServerGetIp }) {


    useEffect(() => {

        if (isNotHuman()) {
            return; // Do not show ads if is not human
        };

        (async () => {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            const userIp = data?.ip || null;

            if (userIp) {
                console.log('ipfly get userIp is: '+ userIp)
            };

            if (userServerGetIp) {
                console.log('User server get Ip is:' + userServerGetIp)
                
            }

        })();

    }, []);

    return null;
};
