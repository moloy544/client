'use client'

import { useRouter } from 'next/navigation'
import { cloneElement } from 'react';

function NavigateBack({ children }) {

  const router = useRouter();

  const back = () => {
    if (window.history && window.history?.length > 1) {
      router.back();
    } else {
      router.push('/');
    }

  };

 // Clone the child element and add the onClick handler
 const childWithOnClickBack = children ? cloneElement(children, { onClick: back }) : null;
  
 return childWithOnClickBack;
};

export default NavigateBack;
