import axios from "axios";
import { loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";
import SomthingWrongError from "@/app/components/errors/SomthingWrongError";

const getActorData = async (actorName, industry) => {

  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/actress/info`, {
      actorDetails: {
        industry, 
        actorName
      }
    });
   
    const { name, avatar } = response.data?.actor;

    return { status: response.status, name, avatar };

  } catch (error) {
    
    return { status: 404 };

  }
};

export async function generateMetadata({ params }) {

  try {

    const { industry, actor } = params;

    const { status, name, avatar } = await getActorData(actor, industry);

    if (status === 200) {

      const metaData = {
        title: name,
        description: `Watch ${name} movies online free of cost Movies Bazaar`,
        keywords: `${name} movie, Watch ${name} movie online, ${name} movie watch free online, Where to watch ${name} movies online`,

        openGraph: {
          images: avatar,
          title: name,
          description: `Watch ${name} movies online free of cost Movies Bazaar`,
          url: `https://moviesbazaar.vercel.app/listing/actress/${actor}`
        },
      };

      return metaData;

    }
  } catch (error) {
    console.log("No Actor Found")
  };
};

export default async function Page({ params }) {

  const { industry, actor } = params;

  const actorName = transformToCapitalize(actor);

  const apiUrl = `${appConfig.backendUrl}/api/v1/actress/collaction`;

  const filterData = { dateSort: -1 };

  const [actorData, moviesData] = await Promise.all([

    getActorData(actor, industry),

    loadMoreFetch({
      apiPath: apiUrl,
      bodyData:{filterData, actor: actorName},
      limitPerPage: 30,
    })
  ]);

  const { status, name } = actorData;
  
  if (status !== 200) {

    return (
      <SomthingWrongError />
    )
  };

  const { filterResponse, dataIsEnd } = moviesData;

  return (
    <>
      <NavigateBackTopNav title={name} />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2 relative">

        {filterResponse.length > 1 ? (
          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
            apiBodyData={{actor: actorName}}
            limitPerPage={30}
            initialFilter={filterData}
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



