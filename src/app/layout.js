import './globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from 'next/font/google'
import ReduxProvider from './context/ReduxProvider'
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Movies Bazzer',
  description: 'Download latest release bollywood hollywood hindi dubbed movies online Movies Bazzer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Navbar />
       {children}
        </ReduxProvider>
        </body>
    </html>
  )
}
