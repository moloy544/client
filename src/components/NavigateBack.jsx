'use client'

import { useRouter } from 'next/navigation'

function NavigateBack({ children }) {

  const router = useRouter();

  const back = () => {
    if (window.history && window.history?.length > 1) {
      router.back();
    } else {
      router.push('/');
    }

  };

  return (
    <div onClick={back}>
      {children}
    </div>
  )
};

export default NavigateBack;
