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
          url: `https://moviesbazar.online/listing/actress/${actor}`
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

  const filterData = {
    sortFilter: { dateSort: -1 },
    categoryFilter: { genre: "all" }
  };

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

  const { data, dataIsEnd } = moviesData;

  return (
    <>
      <NavigateBackTopNav title={name} />

      <div className="w-full h-full min-h-[90vh] py-3 mobile:py-2 relative">

          <LoadMoreMoviesGirdWarper
            apiUrl={apiUrl}
            apiBodyData={{actor: actorName}}
            limitPerPage={30}
            filterCounter={data.filterCount}
            initialFilter={filterData}
            initialMovies={data.moviesData || []}
            isDataEnd={dataIsEnd} />

      </div>
    </>
  )
};



