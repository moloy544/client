import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import { BASE_OG_IMAGE_URL } from "@/constant/assets_links";
import { categoryArray } from "@/constant/constsnt";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false });

const validateCategory = (category) => {
  if (!category || category === '' || category === "") return false; // If category is empty, return false

  // Convert category to lowercase for case-insensitive comparison
  const validCategories = categoryArray.map(item => item.name.toLowerCase());

  return validCategories.includes(category.toLowerCase());
};

export async function generateMetadata({ params }) {

  const editParamsQuery = transformToCapitalize(params.categoryName);

  const isValidcategory = validateCategory(editParamsQuery);
  if (!isValidcategory) {
    return;
  };

  const metaData = {
    title:{
      absolute:`Watch ${editParamsQuery} ${editParamsQuery !== "Movies" ? "movies": ''} Collection | Stream Free Online at Movies Bazar`
    },
    description: `Explore a vast collection of ${editParamsQuery} ${editParamsQuery !== "Movies" ? "movies": ''} available for free streaming on Movies Bazar. Watch your favorite ${editParamsQuery !== "Movies" ? "movies": ''} online today!`,

    openGraph: {
      images: BASE_OG_IMAGE_URL,
      title:{
        absolute:`Watch ${editParamsQuery} ${editParamsQuery !== "Movies" ? "movies": ''} Collection | Stream Free Online at Movies Bazar`
      },
      description: `Explore a vast collection of ${editParamsQuery} ${editParamsQuery !== "Movies" ? "movies": ''} available for free streaming on Movies Bazar. Watch your favorite ${editParamsQuery !== "Movies" ? "movies": ''} online today!`,
      url: `${appConfig.appDomain}/browse/category/${params.categoryName}`,
    },
  };
  

  return metaData;
};

export default async function Page({ params }) {

  const category = params?.categoryName;

  const editParamsQuery = transformToCapitalize(category);

  const isValidcategory = validateCategory(editParamsQuery);

  const apiUrl = `${appConfig.backendUrl}/api/v1/movies/category/${category}`;

  const filterData = {
    dateSort: -1,
    genre: "all",
  };

  const { status, data, dataIsEnd } = isValidcategory && await loadMoreFetch({

    apiPath: apiUrl,
    bodyData: { filterData },
    limitPerPage: 40
  });
  if (status === 404 || !isValidcategory) {
    notFound();
  } else if (status === 500) {
    return (
      <SomthingWrongError />
    )
  };

  const categoryName = transformToCapitalize(params.categoryName);

  const { filterOptions, moviesData } = data;

  return (
    <>
      <NavigateBackTopNav title={categoryName} />

      <div className="w-full h-full min-h-[90vh]">

        <LoadMoreMoviesGirdWarper
          title={categoryName + ' Collection'}
          apiUrl={apiUrl}
          limitPerPage={40}
          serverResponseExtraFilter={filterOptions || []}
          initialFilter={filterData}
          initialMovies={moviesData || []}
          isDataEnd={dataIsEnd}
        />

      </div>

    </>
  )
};