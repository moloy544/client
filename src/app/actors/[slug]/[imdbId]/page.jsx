import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { creatUrlLink, loadMoreFetch, transformToCapitalize } from "@/utils";
import { appConfig } from "@/config/config";
import LoadMoreMoviesGirdWarper from "@/components/LoadMoreMoviesGirdWarper";
import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import Footer from "@/components/Footer";

const SomthingWrongError = dynamic(() => import('@/components/errors/SomthingWrongError'), { ssr: false })

const getActorData = async (imdbId) => {
  let status = 500; // Default status in case of an error
  let name = null;
  let avatar = null;
  let industry = null;

  try {
    const response = await axios.post(`${appConfig.backendUrl}/api/v1/actress/info/${imdbId}`);
    const { actor } = response.data || {};
    if (actor) {
      name = transformToCapitalize(actor.name);
      avatar = actor.avatar;
      industry = actor.industry;
    }
    status = response.status;
  } catch (error) {
    if (error.response) {
      status = error.response.status;
    }
  }

  return { status, name, avatar, industry };
};


export async function generateMetadata({ params }) {

  try {

    const { imdbId } = params;

    const { status, name, avatar } = await getActorData('nm' + imdbId);

    if (status === 200) {

      const metaData = {
        title: name,
        description: `Watch ${name} movies online free of cost Movies Bazaar`,
        keywords: `${name} movie, Watch ${name} movie online, ${name} movie watch free online, Where to watch ${name} movies online`,

        openGraph: {
          images: avatar,
          title: name,
          description: `Watch ${name} movies online free of cost Movies Bazaar`,
          url: `${appConfig.appDomain}/actress/${creatUrlLink(name)}/${imdbId}`
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
    dateSort: -1,
    genre: "all",
  };

  const [actorData, { data, dataIsEnd }] = await Promise.all([

    getActorData('nm' + imdbId),

    loadMoreFetch({
      apiPath: apiUrl,
      bodyData: { filterData, actor: 'nm' + imdbId },
      limitPerPage: 40,
    })
  ]);

  const { status, name, avatar } = actorData;

  if (status === 404) {
    notFound();
  } else if (status === 500) {
    return (
      <SomthingWrongError />
    )
  };

  const { moviesData, filterOptions } = data;

  return (
    <>
      <NavigateBackTopNav title={name} titleImage={{ src: avatar, alt: name }} />

      <div className="w-full h-full min-h-screen bg-gray-800 py-3 mobile:py-2 relative">

        <LoadMoreMoviesGirdWarper
          apiUrl={apiUrl}
          apiBodyData={{ actor: 'nm' + imdbId }}
          limitPerPage={40}
          serverResponseExtraFilter={filterOptions || []}
          initialFilter={filterData}
          initialMovies={moviesData || []}
          isDataEnd={dataIsEnd} />

      </div>
      <Footer />
    </>
  )
};



