import './globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from 'nextjs-toploader';
import ReduxStatePrivider from '@/context/ReduxStatePrivider';
import Footer from './components/Footer';

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

export const viewport = {
  themeColor: 'rgb(29, 29, 29)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <NextTopLoader
          color="rgb(255, 171, 15)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={300}
          shadow="0 0 10px rgb(250, 250, 24),0 0 5px rgb(250, 250, 24)"
        />

        <ReduxStatePrivider>
          <div className="w-full h-full bg-gray-800 dark:bg-gray-800 min-h-screen">
            {children}
          </div>
        </ReduxStatePrivider>

        <SpeedInsights />

        <Footer />

      </body>
    </html>
  )
}
