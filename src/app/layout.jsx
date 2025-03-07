import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Suspense } from 'react';
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';
import ReduxStatePrivider from '@/context/ReduxStatePrivider';
import { appConfig } from '@/config/config';
import CustomLoadingAds from '@/components/ads/CustomLoadingAds';
import { BASE_OG_IMAGE_URL } from '@/constant/assets_links';
import SocialJoinAlert from '@/components/models/SocialJoinAlert';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {

  title: {
    default: 'Movies Bazar | Watch Latest Bollywood, Hollywood, and Hindi Dubbed Movies Online',
    template: '%s | Movies Bazar'
  },
  description: 'Watch latest release bollywood, hollywood, south, hindi dubbed, and more movies online with multi audio and multi quality upto 1080P Movies Bazar',
  keywords: 'online movies, watch movies online, movie streaming, film, cinema, entertainment, Hollywood movies, Hollywood dubbed movies, South movies, South dubbed movies, Bollywood movies',

  openGraph: {
    images: BASE_OG_IMAGE_URL,
    title: {
      default: 'Movies Bazar | Watch Latest Bollywood, Hollywood, and Hindi Dubbed Movies Online',
      template: '%s | Movies Bazar',
    },
    description: 'Watch latest release bollywood, hollywood, south, hindi dubbed, and more movies online with multi audio and multi quality upto 1080P Movies Bazar',
    url: appConfig.appDomain
  },
}

export const viewport = {
  themeColor: 'rgb(29, 29, 29)',
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader
          color="#08D5BB"
          initialPosition={0.2}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={400}
          shadow="0 0 10px #08D5BB,0 0 5px #08D5BB"
        />

        <ReduxStatePrivider>
          <SocialJoinAlert />
          {children}
          {process.env.NODE_ENV !== "production" && (
            <Suspense>
              <CustomLoadingAds />
            </Suspense>
          )}
        </ReduxStatePrivider>

      </body>
    </html>
  )
}
