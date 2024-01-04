import Link from "next/link";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import NavigateBack from "@/app/components/NavigateBack";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import axios from "axios";
import { notFound } from "next/navigation";

const getActorData = async (actorName) => {

  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/actress/info/${actorName}`);
    const status = response.status;
    const { name, avatar } = response.data?.actor;
    return { status, name, avatar };
  } catch (error) {
    console.log(error);
    return { status: 404, name: null, avatar: null };

  }
};

export async function generateMetadata({ params }) {

  try {
    const actorName = params?.actorName;

    const { status, name, avatar } = await getActorData(actorName);

    if (status === 200) {

      const metaData = {
        title: `${name} movies`,
        description: `Watch ${name} movies online Movies Bazaar`,
        keywords: `${name} movie, Watch ${name} movie online, ${name} movie watch free online, Where to watch ${name} movies online`,

        openGraph: {
          images: avatar,
          title: `${name} movies`,
          description: `Watch ${name} movies online Movies Bazaar`,
          url: `https://moviesbazaar.vercel.app/listing/actress/${params?.actorName}`
        },
      };

      return metaData;

    }
  } catch (error) {
    console.log("No Actor Found")
  };
};

//Revalidate page every 30 minutes
export const revalidate = 1800;

export default async function Page({ params }) {

  const query = params?.actorName;

  const apiUrl = `${appConfig.backendUrl}/api/v1/actress/collaction/${query}`;

  const [actorData, moviesData] = await Promise.all([

    getActorData(query),

    fetchLoadMoreMovies({
      apiPath: apiUrl,
      limitPerPage: 30,
      page: 1
    })
  ]);

  const { status, name } = actorData;

  if (status === 404) {
    notFound();
  };

  const { filterResponse, dataIsEnd } = moviesData;

  const actorName = name;

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-auto flex justify-between items-center bg-red-800 px-2 border-b border-b-yellow-700">

        <div className="w-auto h-auto flex items-center py-4 mobile:py-2">
          <NavigateBack className="bi bi-arrow-left text-white text-3xl mobile:text-[25px] cursor-pointer" />
          <div className="px-5 mobile:px-2 text-yellow-400 text-xl mobile:text-base text-center justify-self-center truncate">
            {actorName}
          </div>
        </div>
        <Link href="/search" className="text-white mr-20 mobile:mr-3 p-1 text-2xl mobile:text-xl">
          <i className="bi bi-search"></i>
        </Link>
      </div>

      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-3 mobile:py-2 relative">

        {filterResponse.length > 1 ? (
          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
            initialPage={1}
            initialMovies={filterResponse}
            isDataEnd={dataIsEnd} />
        ) : (
          <div className=" w-full h-auto min-h-[90vh] flex justify-center items-center">
            <div className="w-fit h-auto px-4 py-1.5 text-white bg-yellow-500 text-base mobile:text-sm text-center font-semibold">
              No movies found
            </div>
          </div>
        )}

      </div>
    </>
  )
};



