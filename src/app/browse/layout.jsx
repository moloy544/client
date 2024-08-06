import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
    return (
        <div className="w-full min-h-screen bg-gray-800">
            {children}
            <Footer />
        </div>
    )
}
