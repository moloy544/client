import Link from "next/link"

export default function CategoryGroupSlider(){

    return(
        <div className="flex flex-row overflow-y-scroll whitespace-nowrap gap-3 px-4 mobile:px-3 pt-6 text-sm font-normal text-white">
        <Link href="/category/new-release" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">New Release</Link>
        <Link href="/category/bollywood" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Bollywood</Link>
        <Link href="/category/hollywood" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Hollywood</Link>
        <Link href="/category/web-series" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Web series</Link>
        <Link href="/category/hindi-dubbed" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Hindi dubbed</Link>
        <Link href="/category/sify" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">SIFI</Link>
        <Link href="/category/comedy" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Comedy</Link>
        <Link href="/category/romance" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Romance</Link>
        <Link href="/category/south" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">South</Link>
        <Link href="/category/animation" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Animation</Link>
        <Link href="/category/horror" className="bg-purple-600 w-auto h-auto px-5 py-[10px] rounded-[4px] cursor-pointer">Horror</Link>
      </div>

    )
}