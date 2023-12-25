import { categoryArray } from "@/constant/constsnt"
import Link from "next/link"

export default function CategoryGroupSlider() {

  return (

    <div className="w-auto h-auto bg-white flex flex-row items-center overflow-y-scroll gap-3 mobile:gap-2 whitespace-nowrap pt-4 px-2 border border-t-transparent border-b-gray-300 scroll-smooth">

      {categoryArray.map((category) => (
        <Link
          key={category.id}
          href={`/listing/category/${category.name.toLowerCase().replace(/[' ']/g, '-')}`}
          className="bg-red-800 w-auto h-auto px-4 py-2 mobile:px-3 rounded-[4px]">
          <span className="w-auto h-auto text-sm mobile:text-xs font-normal text-white">{category.name}</span>
        </Link>
      ))}

    </div>

  )
}