'use client'
import { useRouter } from "next/navigation";
export default function Videoplayer({ videoSource }) {

  const router = useRouter();
  if (!videoSource) {
    router.push('/');
  }

  return (
    <iframe className="fixed top-0 left-0 w-full h-full border-none z-[600]" src={videoSource} allowFullScreen="allowfullscreen"></iframe>
  )
}
