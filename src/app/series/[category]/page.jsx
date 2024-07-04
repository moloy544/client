import Link from "next/link";
import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import { moviesGenreArray } from "@/constant/constsnt";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";


export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalize(params.category);

  const metaData = {
    title: `${editParamsQuery} series`,
    description: `Watch ${editParamsQuery} series online Movies Bazaar`,
    keywords: `${editParamsQuery} series, Watch ${editParamsQuery} series online, ${editParamsQuery} series watch free online, Where to watch ${editParamsQuery} series online`,

    openGraph: {
      images: 'https://res.cloudinary.com/dxhafwrgs/image/upload/v1705866104/moviesbazaar/moviesbazaar_brand_logo.jpg',
      title: `${editParamsQuery} series`,
      description: `Watch ${editParamsQuery} series online Movies Bazaar`,
      url: `${appConfig.appDomain}/series/${params.category}`
    },
  };

  return metaData;
};

export default async function Page({ params }) {

  const category = params.category;

  const apiUrl = `${appConfig.backendUrl}/api/v1/series/${category}`;

  const filterData = {
    dateSort: -1,
    genre: "all",
  };

  const { data, dataIsEnd } = await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 30
  });

  const title = transformToCapitalize(category + ' series');

  const filterOptions = [];

  if (data.genreFilter) {
    filterOptions.unshift({ title: "Filter by genre", data: data.genreFilter });
  };

  return (
    <>
      <NavigateBackTopNav title={title} />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2">


        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          limitPerPage={40}
          serverResponseExtraFilter={filterOptions}
          initialFilter={filterData}
          initialMovies={data.moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};

function CategoryGroupSlider({ category }) {

  return (
    <div className="space-y-2 fixed top-[70px] mobile:top-14 right-4 z-50">
      <details
        className="overflow-hidden rounded-sm border border-gray-300 [&_summary::-webkit-details-marker]:hidden shadow-xl"
      >
        <summary
          className="flex cursor-pointer items-center justify-between gap-2 bg-white p-2 text-gray-900 transition"
        >
          <span className="text-sm font-medium">Filter</span>

          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </summary>

        <div className="border-t border-gray-200 bg-white flex justify-center">

          <div className="space-y-1 border-t border-gray-200 p-4 max-h-[400px] overflow-y-auto">

            {moviesGenreArray.genre?.map((data) => (

              <div key={data.id} className="w-auto h-auto bg-rose-600 py-1.5 px-2 flex-1 gap-7 text-sm text-gray-200 text-center font-medium rounded-md">
                <Link href={`/series/${category}?genre=${data.name?.toLocaleLowerCase().replace(/[' ']/g, '-')}`}>
                  {data.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </details>

    </div>

  )
}