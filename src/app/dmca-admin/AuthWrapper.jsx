'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { appConfig } from '@/config/config';
import { motion, AnimatePresence } from 'framer-motion';
import DmcaAdminDashboard from './Dashboard';
import { useDeviceType } from '@/hooks/deviceChecker';

export default function AuthWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const { isMobile } = useDeviceType();

  useEffect(() => {

    if (isMobile) {
      setLoading(false); // skip auth if mobile
      return;
    }

    axios
      .get(`${appConfig.backendUrl}/api/v1/dmca-admin/check-auth`, {
        withCredentials: true,
      })
      .then((data) => {
        setLoading(false);
        setCompanyData(data.data);
        if (pathname !== '/dmca-admin') {
          router.replace('/dmca-admin');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Authorization failed. Please login.');
        setTimeout(() => {
          router.replace('/dmca-admin/login');
        }, 1500);
      });
  }, [pathname, router, isMobile]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
          >
            <div className="w-12 h-12 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-700 text-lg font-semibold">
              Checking authorization...
            </p>
          </motion.div>
        )}

        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-red-100 z-50 p-4"
          >
            <p className="text-red-700 text-center text-lg font-medium">
              {error}
            </p>
          </motion.div>
        )}

        {!loading && isMobile && (
          <motion.div
            key="mobile-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50 px-6"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                Access Denied on Mobile
              </h1>
              <p className="text-gray-700 text-base max-w-md">
                The DMCA Admin Dashboard is only accessible from a desktop or
                laptop. Please switch to a larger device to manage takedowns.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && !isMobile && (
        <DmcaAdminDashboard companyData={companyData} />
      )}
    </>
  );
}
