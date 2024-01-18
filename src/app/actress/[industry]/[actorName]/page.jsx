import axios from "axios";
import { notFound } from "next/navigation";
import { fetchLoadMoreMovies } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";

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
      <NavigateBackTopNav title={actorName} />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2 relative">

        {filterResponse.length > 1 ? (
          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
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



