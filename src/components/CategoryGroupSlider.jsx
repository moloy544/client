import { Fragment } from "react"
import Link from "next/link"
import { categoryArray, moviesGenreArray } from "@/constant/constsnt"
import { creatUrlLink } from "@/utils"
import { useDeviceType } from "@/hooks/deviceChecker"

const LinkButton = ({ linkData, parentUrl }) => {

  return (
    <>
      {linkData?.map(({ id, name, linkUrl, visiblity }) => (
        <Fragment key={id}>
          {typeof visiblity === "boolean" && !visiblity ? null :
            <Link
              title={name} // Tooltip for user
              href={linkUrl
                ? linkUrl
                : parentUrl + "/" + creatUrlLink(name.replace('-', ' '))}
            >
              <div className="bg-[#1D263B] hover:bg-gray-700 w-auto h-auto py-2 px-3 rounded-[5px] font-medium text-xs text-gray-300 whitespace-nowrap">
                {name}
              </div>

            </Link>
          }
        </Fragment>
      ))}

    </>
  )
}

export default function CategoryGroupSlider() {

  const { isIOS } = useDeviceType();

  return (
    isIOS ? (
      <div className="sticky top-0 z-30 w-full bg-gray-900 shadow-md">
        <div className="w-full flex items-center flex-row overflow-x-auto scroll-smooth px-3 space-x-3 mobile:space-x-2 min-h-[48px] py-2 scrollbar-hidden">
          <LinkButton linkData={categoryArray} parentUrl="/browse/category" />
          <LinkButton linkData={moviesGenreArray} parentUrl="/browse/genre" />
        </div>
      </div>
    ) : (
      <div className="sticky top-0 z-30 w-full h-fit bg-gray-900">
        <div className="w-auto h-auto-fit flex items-center flex-row overflow-y-scroll space-x-3 mobile:space-x-2 px-2 pt-3.5 scroll-smooth scrollbar-hidden">
          <LinkButton
            linkData={categoryArray}
            parentUrl="/browse/category" />

          <LinkButton
            linkData={moviesGenreArray}
            parentUrl="/browse/genre" />
        </div>
      </div>
    )
  )
};