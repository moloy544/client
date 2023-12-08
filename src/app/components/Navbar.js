import Link from "next/link";

export default function Navbar() {

    return (
        <>
        <header>
            <nav className="main-topnav bg-purple-600 text-white mobile:py-2 py-4 px-5 w-full h-auto flex items-center mobile:flex-col mobile:space-y-3 md:justify-between">
                <Link href="/movies" className="font-semibold mobile:text-base text-xl">Movies Bazzar</Link>
                <input className="w-80 h-10 mobile:w-full rounded-md mobile:text-sm text-md px-2 placeholder:text-gray-600 text-black caret-fuchsia-700 py-1" type="text" placeholder="Search movies web series" />
            </nav>
        </header>
        <div className="mt-16 mobile:my-[90px]"></div>
        </>
    )
}
