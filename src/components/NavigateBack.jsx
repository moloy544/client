'use client'

import { safeSessionStorage } from '@/utils/errorHandlers';
import { useRouter } from 'next/navigation'
import { cloneElement } from 'react';

function NavigateBack({ children }) {

  const router = useRouter();

  const back = () => {
    const homeRedirectOnHistoryBack = safeSessionStorage.get('homeRedirectOnHistoryBack');
    if (homeRedirectOnHistoryBack && homeRedirectOnHistoryBack === 'true') {
      router.push('/');
    } else {
      router.back();
    };

  };

  // Clone the child element and add the onClick handler
  const childWithOnClickBack = children ? cloneElement(children, { onClick: back }) : null;

  return childWithOnClickBack;
};

export default NavigateBack;
