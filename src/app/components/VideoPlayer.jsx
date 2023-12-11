"use client"
import { useSearchParams } from 'next/navigation';

export default function Videoplayer() {

    const searchParams = useSearchParams();

    const sourceUrl = searchParams.get('movie');

    const decodedUrl = decodeURIComponent(sourceUrl);
  
  return (
    <iframe className="fixed top-0 left-0 w-full h-full border-none z-[600]" src={decodedUrl} allowFullScreen="allowfullscreen"></iframe>
  )
}
