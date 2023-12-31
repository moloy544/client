import { categoryArray } from "@/constant/constsnt"
import Link from "next/link"

export default function CategoryGroupSlider() {

  return (

    <div className="w-auto h-auto bg-yellow-600 flex flex-row items-center overflow-y-scroll gap-3 mobile:gap-2 whitespace-nowrap pt-4 px-2 border border-yellow-600 scroll-smooth">

      {categoryArray.map((category) => (
        <Link 
          key={category.id}
          href={`/listing/category/${category.name.toLowerCase().replace(/[' ']/g, '-')}`}
          className="bg-gray-800 w-auto h-auto py-1 px-3 rounded-[4px]">
          <span className="w-auto h-auto text-xs font-normal text-gray-200">{category.name}</span>
        </Link>
      ))}

    </div>

  )
}