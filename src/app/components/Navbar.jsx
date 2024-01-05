'use client'
import Link from "next/link";
import CategoryGroupSlider from "./CategoryGroupSlider";
import { usePathname } from "next/navigation";

export default function Navbar() {

    const pathname = usePathname();

    if (pathname === "/search") {
        return null;
    };

    return (
        <>
            <header className="w-full h-auto bg-white">

                <nav className="w-auto h-auto bg-red-800 py-4 px-5 mobile:px-3 mobile:py-2 flex items-center justify-between border-b border-t border-red-700">
                    <Link href="/" className="font-semibold text-yellow-300 text-xl mobile:text-base">
                        Movies Bazaar
                    </Link>

                    <Link href="/search" className="cursor-text">
                        <div className="flex items-center w-96 h-10 mobile:w-full mobile:h-9 rounded-md mobile:text-sm text-md py-1 px-2 bg-white text-black border-2 border-yellow-500 mobile:hidden">
                            Search movies web series
                        </div>
                    </Link>
                </nav>

            </header>

            <CategoryGroupSlider />
        </>
    )
}
