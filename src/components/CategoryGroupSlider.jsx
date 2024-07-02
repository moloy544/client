
import Link from "next/link"
import { categoryArray, moviesGenreArray } from "@/constant/constsnt"

const LinkButton = ({ linkData, linkUrl }) => {

  return (
    <>
      {linkData?.map((data) =>
      (<div key={data.id} className="bg-gray-700 w-auto h-auto py-2 px-3 rounded-[5px] flex-none text-xs text-gray-200">
        <Link
        title={data.name}
          href={data.linkUrl ? data.linkUrl.toLowerCase().replace(/[' ']/g, '-') :
            linkUrl + "/" + data.name.toLowerCase().replace(/[' ']/g, '-')}>
          {data.name}
        </Link>
      </div>
      ))}
    </>
  )
}

export default function CategoryGroupSlider() {

  return (
    <div className="sticky top-0 z-30 w-full h-fit bg-gray-900">

      <div className="w-auto h-auto-fit flex items-center flex-row overflow-y-scroll space-x-3 mobile:space-x-2 px-2 pt-3.5 border-b border-b-cyan-800 scroll-smooth scrollbar-hidden">

        <LinkButton linkData={categoryArray} linkUrl="/browse/category" />

        <LinkButton linkData={moviesGenreArray} linkUrl="/browse/genre" />

      </div>
    </div>

  )
}