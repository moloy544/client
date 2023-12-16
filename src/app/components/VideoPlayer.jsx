'use client'
import { useRouter } from "next/navigation";
export default function Videoplayer({ movieSource }) {

  const router = useRouter();
  if (!movieSource) {
    router.push('/');
  }

  const movieFullSource = `https://traze-cocarruptoo-i-266.site/play/${movieSource}`;
  
  return (
    <iframe className="fixed top-0 left-0 w-full h-full border-none z-[600]" src={movieFullSource} allowFullScreen="allowfullscreen"></iframe>
  )
}
