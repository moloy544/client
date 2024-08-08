import axios from 'axios';
import { appConfig } from '@/config/config';

export default async function sitemap() {

  const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/generate-sitemap`, {
    params: { limit: 10000 },
  });

  const { movies } = response.data

  return movies.map(({ imdbId, title, type, createdAt }) => ({
    url: `${BASE_URL}/watch/${type}/${creatUrlLink(title)}/${imdbId?.replace('tt', '')}`,
    lastModified: new Date(createdAt).toISOString(),
    changeFrequency: 'weekly'
  }))
}
