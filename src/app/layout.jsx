import './globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title:{
    default: 'Movies Bazzer',
    template: '%s | Movies Bazzer'
  },
  description: 'Download latest release bollywood hollywood hindi dubbed movies online Movies Bazzer',
  openGraph: {
    images: 'https://movies4u.io/uploads/posts/covers/animal-2023-hindi-pre-dvdrip-720p-480p.webp',
    title: 'Movies Bazzer',
    description: 'Download latest release bollywood hollywood hindi dubbed movies online Movies Bazzer',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Navbar />
       {children}
       <SpeedInsights/>
      </body>
    </html>
  )
}
