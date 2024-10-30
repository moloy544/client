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
        title:{
          absolute:`${name} | Movies Bazaar - Watch Free Online`,
        },
        description: `Stream a collection of ${name} best movies online for free at Movies Bazaar. Enjoy classic and latest films featuring ${name} exceptional performances!`,
        keywords: `${name} movies, watch ${name} movies online, ${name} movie collection, stream ${name} movies free, where to watch ${name} films online`,
      
        openGraph: {
          images: avatar,
          title:{
            absolute:`${name} | Movies Bazaar - Watch Free Online`,
          },
          description: `Explore and watch ${name} movies online for free at Movies Bazaar. Discover a range of films showcasing ${name} incredible talent!`,
          url: `${appConfig.appDomain}/actor/${creatUrlLink(name)}/${imdbId}`,
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

      <div className="w-full h-full min-h-[80vh] bg-gray-800 py-3 mobile:py-2 relative">

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



