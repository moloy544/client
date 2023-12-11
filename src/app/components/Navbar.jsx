import Link from "next/link";
import CategoryGroupSlider from "./CategoryGroupSlider";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

    const navigateToSearch = () => {
        
        router.push('/search');
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full h-auto bg-white">
                <nav className="w-auto h-auto bg-purple-600 text-white mobile:py-3 py-4 px-5 flex items-center mobile:flex-col mobile:space-y-3 md:justify-between">
                    <Link href="/" className="font-semibold text-xl">Movies Bazzar</Link>
                    <input onClick={navigateToSearch} className="w-80 h-10 mobile:w-full rounded-md mobile:text-sm text-md px-2 placeholder:text-gray-600 text-black caret-fuchsia-700 py-1" type="text" placeholder="Search movies web series" readOnly />
                </nav>
                <CategoryGroupSlider />
            </header>
        </>
    )
}
