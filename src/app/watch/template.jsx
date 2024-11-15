'use client'

import { motion } from "framer-motion"

// Template for make all page animations
export default function Template({ children }) {
    return (
<div className="min-w-full min-h-screen bg-gray-900">
        <motion.div
            initial={{ rotateY: 10, opacity: 0.4 }}  // Start with a higher opacity to avoid content delay
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 10, opacity: 0.5 }}
            transition={{ ease: 'easeInOut', duration: 0.5 }}  // Reduced duration for faster transitions
            className="min-h-screen bg-gray-800"
        >
            {children}
        </motion.div>
        </div>

    )
};
