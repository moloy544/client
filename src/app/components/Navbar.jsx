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

                <nav className="w-auto h-auto bg-red-800 py-4 px-5 mobile:px-3 mobile:py-2 flex items-center justify-between">
                    <Link href="/" className="font-semibold text-yellow-400 text-xl mobile:text-base">
                        Movies Bazaar
                    </Link>

                    <Link href="/search" className="cursor-text mobile:hidden">
                        <div className="flex items-center w-96 h-10 mobile:w-full mobile:h-9 rounded-[12px] mobile:text-sm text-md py-1 px-2 bg-white text-black border-2 border-rose-400">
                            Search movies web series
                        </div>
                    </Link>

                    <Link href="/search" className="hidden mobile:block p-0.5 mx-3">
                        <i className="bi bi-search text-gray-200 text-xl"></i>
                    </Link>
                </nav>

            </header>

            <CategoryGroupSlider />
        </>
    )
}
