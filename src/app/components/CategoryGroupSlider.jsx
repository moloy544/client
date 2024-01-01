import { categoryArray, moviesGenreArray } from "@/constant/constsnt"
import Link from "next/link"

const LinkButton = ({ linkData, linkUrl }) => {

  return (
    <>
      {linkData?.map((data) =>
      (<Link
        key={data.id}
        href={linkUrl + "/" + data.name.toLowerCase().replace(/[' ']/g, '-')}
        className="bg-cyan-600 w-auto h-auto py-1 px-3 rounded-[5px]">
        <span className="w-auto h-auto text-xs font-normal text-gray-200">{data.name}</span>
      </Link>
      ))}
    </>
  )
}

export default function CategoryGroupSlider() {

  return (

    <div className="sticky top-0 z-50 w-auto h-auto bg-gray-900 flex flex-row items-center overflow-y-scroll gap-3 mobile:gap-2 whitespace-nowrap pt-4 px-2 border-b border-cyan-700 scroll-smooth scrollbar-hidden">
      <>
        <LinkButton linkData={categoryArray.category} linkUrl={categoryArray.linkUrl} />

        <LinkButton linkData={moviesGenreArray.genre} linkUrl={moviesGenreArray.linkUrl} />
      </>

    </div>

  )
}