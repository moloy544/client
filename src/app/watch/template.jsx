'use client'

import { motion } from "framer-motion"

// Template for make all page animations
export default function Template({ children }) {
    return (
<div className="min-w-full min-h-screen bg-gray-900">
        <motion.div
            initial={{ backgroundColor: '#374151', rotateY: 10, opacity: 0.2 }}
            animate={{ backgroundColor: '#1d2433', rotateY: 0, opacity: 1 }}
            exit={{ backgroundColor: '#374151', rotateY: 10, opacity: 0.2 }}
            transition={{ ease: 'easeInOut', duration: 0.75 }}
        >
            {children}
        </motion.div>
        </div>

    )
};
