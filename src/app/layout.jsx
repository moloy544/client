import './globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from 'nextjs-toploader';

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
    url: 'https://moviesbazaar.vercel.app'
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />

        {children}

        <SpeedInsights />

      </body>
    </html>
  )
}
