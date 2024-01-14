import { categoryArray, moviesGenreArray } from "@/constant/constsnt"
import Link from "next/link"

const LinkButton = ({ linkData, linkUrl }) => {


  return (
    <>
      {linkData?.map((data) =>
      (<div key={data.id} className="bg-rose-600 w-auto h-auto py-1 px-3 rounded-[5px] flex-none"><Link
        href={
          data.linkUrl ? data.linkUrl.toLowerCase().replace(/[' ']/g, '-') :
          linkUrl + "/" + data.name.toLowerCase().replace(/[' ']/g, '-')}>
        <span className="w-auto h-auto text-xs text-gray-200">{data.name}</span>
      </Link>
      </div>
      ))}
    </>
  )
}

export default function CategoryGroupSlider() {

  return (
<div className="sticky top-0 z-30 w-full h-fit bg-gray-900">

    <div className="w-auto h-auto-fit flex items-center flex-row overflow-y-scroll gap-3 mobile:gap-2 px-2 pt-3.5 border-b border-cyan-800 scroll-smooth scrollbar-hidden">

        <LinkButton linkData={categoryArray.category} linkUrl={categoryArray.linkUrl} />
      
        <LinkButton linkData={moviesGenreArray.genre} linkUrl={moviesGenreArray.linkUrl} />
      
    </div>
    </div>

  )
}