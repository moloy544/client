import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import NextTopLoader from 'nextjs-toploader';
import ReduxStatePrivider from '@/context/ReduxStatePrivider';
import { appConfig } from '@/config/config';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {

  title: {
    default: 'Movies Bazar',
    template: '%s | Movies Bazar'
  },
  description: 'Watch latest release bollywood, hollywood, south, hindi dubbed, and more movies online Movies Bazar',
  keywords: 'online movies, watch movies online, movie streaming, film, cinema, entertainment, Hollywood movies, Hollywood dubbed movies, South movies, South dubbed movies, Bollywood movies',

  openGraph: {
    images: 'https://res.cloudinary.com/moviesbazar/image/upload/v1722170830/logos/brand_log.jpg',
    title: {
      default: 'Movies Bazar',
      template: '%s | Movies Bazar',
    },
    description: 'Watch latest release bollywood, hollywood, south, hindi dubbed, and more movies online Movies Bazar.',
    url: appConfig.appDomain
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
          color="rgb(218, 8, 95)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={300}
          shadow="0 0 10px rgb(218, 8, 95),0 0 5px rgb(218, 8, 95)"
        />

        <ReduxStatePrivider>
            {children}
        </ReduxStatePrivider>
        {process.env.NODE_ENV === "production" && (
          <Suspense>
            <SpeedInsights />
            <Analytics />
          </Suspense>
        )}

      </body>

    </html>
  )
}
