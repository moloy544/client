import { notFound } from "next/navigation";
import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import { BASE_OG_IMAGE_URL } from "@/constant/assets_links";
import { categoryArray } from "@/constant/constsnt";

const otherExpectedCategories = [
  'international','hindi', 'hindi dubbed', 'tollywood', 'bengali dubbed', 'english', 'pollywood', 'punjabi',
  'tamil', 'telugu', 'malayalam', 'kannada', 'dubbed', 'korean',
  'japanese', 'chinese', 'french', 'german', 'spanish', 'italian',
  'portuguese', 'arabic', 'turkish', 'thai', 'vietnamese',
  'indonesian', 'filipino', 'swedish', 'norwegian', 'danish',
  'finnish', 'russian', 'ukrainian', 'polish', 'hungarian',
  'czech', 'slovakian','documentary'
];

const validateCategory = (category) => {
  if (!category?.trim()) return false; // Empty or whitespace-only check

  const normalizedCategory = category.toLowerCase().trim();

  const validCategories = [
    ...categoryArray.map(item => item.name.toLowerCase()),
    ...otherExpectedCategories
  ];

  // Check against predefined lists or if the category contains "dubbed"
  return validCategories.includes(normalizedCategory) || normalizedCategory.includes('dubbed');
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
    alternates: {
      canonical: `${appConfig.appDomain}/browse/category/${params.categoryName}`
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
  }

  const categoryName = transformToCapitalize(params.categoryName);

  const { filterOptions, moviesData } = data;

  return (
    <>
      <NavigateBackTopNav title={categoryName} />

      <div className="w-full h-full min-h-[90vh]">

        <LoadMoreMoviesGirdWarper
          title={categoryName + ' Collection'}
          description={category === 'hollywood' ? 'Includes international content' : null}
          apiUrl={apiUrl}
          limitPerPage={40}
          serverResponseExtraFilter={filterOptions || []}
          initialFilter={filterData}
          initialMovies={moviesData || []}
          isDataEnd={dataIsEnd}
          apiError={status === 500 ? true : false}
        />

      </div>

    </>
  )
};