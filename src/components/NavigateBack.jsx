'use client'

import { updatefullWebAccessState } from '@/context/fullWebAccessState/fullWebAccessSlice';
import { useRouter } from 'next/navigation'
import { cloneElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function NavigateBack({ children }) {

  const router = useRouter();
  const dispatch = useDispatch();

  const { homeRedirectOnHistoryBack } = useSelector((state) => state.fullWebAccessState);

  const back = () => {
    if (!homeRedirectOnHistoryBack) {
      router.back();
    } else {
      router.push('/');
      dispatch(
        updatefullWebAccessState({
          homeRedirectOnHistoryBack: false,
        })
      );
    };

  };

 // Clone the child element and add the onClick handler
 const childWithOnClickBack = children ? cloneElement(children, { onClick: back }) : null;
  
 return childWithOnClickBack;
};

export default NavigateBack;
