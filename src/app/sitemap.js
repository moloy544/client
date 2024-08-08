import axios from 'axios';
import { appConfig } from '@/config/config';
import { creatUrlLink } from '@/utils';

export default async function sitemap() {

  const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/generate-sitemap`, {
    params: { limit: 10000 },
  });

  const { movies } = response.data

  return movies.map(({ imdbId, title, type, createdAt }) => ({
    url: `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${imdbId?.replace('tt', '')}`,
    lastModified: new Date(createdAt).toISOString(),
    changeFrequency: 'weekly'
  }))
}
