import axios from "axios";
import { loadMoreFetch } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/app/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/app/components/NavigateBackTopNav";
import SomthingWrongError from "@/app/components/errors/SomthingWrongError";
import { notFound } from "next/navigation";

const getActorData = async (imdbId) => {

  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/actress/info/${imdbId}`);
  
    const { name, avatar, industry } = response.data?.actor || {};
  
    return { status: response.status, name, avatar, industry };
  } catch (error) {
    return { status: 500}
  }

};

export async function generateMetadata({ params }) {

  try {

    const { imdbId } = params;

    const { status, name, avatar, industry } = await getActorData('nm'+imdbId);

    if (status === 200) {

      const metaData = {
        title: name,
        description: `Watch ${name} movies online free of cost Movies Bazaar`,
        keywords: `${name} movie, Watch ${name} movie online, ${name} movie watch free online, Where to watch ${name} movies online`,

        openGraph: {
          images: avatar,
          title: name,
          description: `Watch ${name} movies online free of cost Movies Bazaar`,
          url: `https://moviesbazar.online/actress/${industry}/${imdbId}`
        },
      };

      return metaData;

    } else {
      return;
    }
  } catch (error) {
    console.log(error)
  };
};

export default async function Page({ params }) {

  const { imdbId } = params;

  const apiUrl = `${appConfig.backendUrl}/api/v1/actress/collaction`;

  const filterData = {
    sortFilter: { dateSort: -1 },
    categoryFilter: { genre: "all" }
  };

  const [actorData, moviesData] = await Promise.all([

    getActorData('nm'+imdbId),

    loadMoreFetch({
      apiPath: apiUrl,
      bodyData: { filterData, actor: 'nm'+imdbId },
      limitPerPage: 30,
    })
  ]);

  const { status, name } = actorData;

  if (status === 201) {

    notFound();

  } else if (status === 500) {
    console.log(status)
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
          apiBodyData={{ actor: imdbId }}
          limitPerPage={30}
          filterCounter={data.filterCount}
          initialFilter={filterData}
          initialMovies={data.moviesData || []}
          isDataEnd={dataIsEnd} />

      </div>
    </>
  )
};



