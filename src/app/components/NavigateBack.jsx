'use client'
import { useRouter } from 'next/navigation'

function NavigateBack({ className }) {

  const router = useRouter();

  const back = () => {
    router.back();
  };

  return <div onClick={back} className={className}></div>

};

export default NavigateBack;
