"use client"
import { useSearchParams } from 'next/navigation';

export default function Videoplayer() {

    const searchParams = useSearchParams();

    const sourceUrl = searchParams.get('watchurl');

  return (
    <video className="h-auto max-h-[450px] w-full min-w-[300px] border border-gray-200 rounded-lg dark:border-gray-700" autoPlay controls>
        <source src={sourceUrl} type="video/mp4" />
          Your browser does not support the video tag.
      </video>
  )
}
