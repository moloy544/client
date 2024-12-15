"use client"

import { useWindowWidth } from '@/hooks/hook';
import Snowfall from 'react-snowfall';

export default function SnowFalls() {

    const windowWidth = useWindowWidth();

    const snowflakeCount = windowWidth < 768
        ? 40  // Fewer snowflakes for small screens
        : windowWidth > 1440
            ? 120 // More snowflakes for very large screens
            : 100; // Default for medium screens

    return (
        <Snowfall
            color="white"
            snowflakeCount={snowflakeCount}  // Fewer snowflakes to prevent clutter
            speed={[0.5, 1.5]}    // Slow and gentle falling speed
            wind={[0, 0.5]}       // Light wind for a soft movement effect
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}
        />

    )
};
