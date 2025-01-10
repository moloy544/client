
import Link from "next/link"
import { categoryArray, moviesGenreArray } from "@/constant/constsnt"
import { creatUrlLink } from "@/utils"

const LinkButton = ({ linkData, linkUrl }) => {

  return (
    <>
      {linkData?.map((data) => (
        <Link
          key={data.id}
          title={data.name} // Tooltip for user
          href={data.linkUrl
            ? creatUrlLink(data.linkUrl)
            : linkUrl + "/" + creatUrlLink(data.name)}
        >
          <div className="bg-[#1D263B] hover:bg-gray-700 w-auto h-auto py-2 px-3 rounded-[5px] font-medium text-xs text-gray-300 whitespace-nowrap">
            {data.name}
          </div>

        </Link>
      ))}

    </>
  )
}

export default function CategoryGroupSlider() {

  return (
    <div className="sticky top-0 z-30 w-full h-fit bg-gray-900">

      <div className="w-auto h-auto-fit flex items-center flex-row overflow-y-scroll space-x-3 mobile:space-x-2 px-2 pt-3.5 scroll-smooth scrollbar-hidden">

        <LinkButton 
        linkData={categoryArray} 
        linkUrl="/browse/category" />

        <LinkButton 
        linkData={moviesGenreArray} 
        linkUrl="/browse/genre" />

      </div>
    </div>

  )
}