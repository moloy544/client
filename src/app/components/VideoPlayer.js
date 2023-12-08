"use client"
import { useSearchParams } from 'next/navigation';

export default function Videoplayer() {

    const searchParams = useSearchParams();

    const sourceUrl = searchParams.get('movie');

    const decoded = decodeURIComponent(sourceUrl);
  
  return (
    <iframe className="fixed top-0 left-0 w-full h-full border-none z-[600]" src={decoded} allowFullScreen="allowfullscreen"></iframe>
  )
}
