'use client'
import Link from "next/link";
import CategoryGroupSlider from "./CategoryGroupSlider";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

    const pathname  = usePathname();

    const navigateToSearch = () => {
        
        router.push('/search');
    };

    if (pathname === "/search") {
       return null; 
    };

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full h-auto bg-white">
                <nav className="w-auto h-auto bg-red-800 text-yellow-300 py-4 px-5 mobile:py-3 flex items-center mobile:flex-col mobile:space-y-3 md:justify-between">
                    <Link href="/" className="font-semibold text-xl mobile:text-base">Movies Bazaar</Link>
                    <input onClick={navigateToSearch} className="w-96 h-10 mobile:w-full mobile:h-9 rounded-md mobile:text-sm text-md py-1 px-2 placeholder:text-gray-600 text-black caret-fuchsia-700" type="text" placeholder="Search movies web series" readOnly />
                </nav>
                <CategoryGroupSlider />
            </header>
        </>
    )
}
