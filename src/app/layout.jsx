import './globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {

  title: {
    default: 'Movies Bazaar',
    template: '%s | Movies Bazaar'
  },
  description: 'Watch latest release bollywood, hollywood, south, hindi dubbed, and more movies online Movies Bazaar',
  keywords: 'online movies, watch movies online, movie streaming, film, cinema, entertainment, Hollywood movies, Hollywood dubbed movies, South movies, South dubbed movies, Bollywood movies',

  openGraph: {
    images: 'https://th.bing.com/th/id/OIP.R7FvRN4lHSBlMMVDBYvCfwHaHa?pid=ImgDet&w=179&h=179&c=7&dpr=1.5',
    title: {
      default: 'Movies Bazaar',
      template: '%s | Movies Bazaar',
    },
    description: 'Watch latest release bollywood, hollywood, south, hindi dubbed, and more movies online Movies Bazaar',
    keywords: 'online movies, watch movies online, movie streaming, film, cinema, entertainment, Hollywood movies, Hollywood dubbed movies, South movies, South dubbed movies, Bollywood movies',
    url: 'https://movies-bazaar.vercel.app'
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
