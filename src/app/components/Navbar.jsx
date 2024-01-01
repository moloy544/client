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
            <header className="w-full h-auto bg-white">
                <nav className="w-auto h-auto bg-red-800 py-4 px-5 mobile:px-3 mobile:py-2 flex items-center justify-between border-b border-t border-red-600">
                    <Link href="/" className="font-semibold text-yellow-300 text-xl mobile:text-base">Movies Bazaar</Link>
                    <input onClick={navigateToSearch} className="w-96 h-10 mobile:w-full mobile:h-9 rounded-md mobile:text-sm text-md py-1 px-2 placeholder:text-gray-600 text-black caret-fuchsia-700 border border-cyan-400 mobile:hidden" type="text" placeholder="Search movies web series" readOnly />
                    <Link href="/search" className="bi bi-search text-white text-xl hidden mobile:block mx-4 p-0.5"></Link>
                </nav>
                
            </header>
            <CategoryGroupSlider />
        </>
    )
}
