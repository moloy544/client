import axios from 'axios';
import { appConfig } from '@/config/config';
import { creatUrlLink } from '@/utils';
import { categoryArray, moviesGenreArray } from '@/constant/constsnt';

export default async function sitemap() {

  const response = await axios.get(`${appConfig.backendUrl}/api/v1/movies/generate-sitemap`, {
    params: { limit: 10000 },
  });

  const { movies } = response.data;

   // Map over categoryArray and moviesGenreArray to create URLs for the sitemap
   const categoryUrls = categoryArray.map(({ name }) => ({
    url: `${appConfig.appDomain}/browse/category/${name.toLowerCase().replace(/[' ']/g, '-')}`,
    changeFrequency: 'weekly',
    lastModified: new Date().toISOString(),
  }));

  const genreUrls = moviesGenreArray.map(({ name }) => ({
    url: `${appConfig.appDomain}/browse/genre/${name.toLowerCase().replace(/[' ']/g, '-')}`,
    changeFrequency: 'weekly',
    lastModified: new Date().toISOString(),
  }));

  // Static URLs
  const staticUrls = [
    { url: `${appConfig.appDomain}/`, changeFrequency: 'daily', lastModified: new Date().toISOString() },
    ...categoryUrls,  // Add category URLs to static URLs
    ...genreUrls,     // Add genre URLs to static URLs
  ]


  // Dynamic movie URLs
  const dynamicUrls = movies.map(({ imdbId, title, type, createdAt }) => ({
    url: `${appConfig.appDomain}/watch/${type}/${creatUrlLink(title)}/${imdbId?.replace('tt', '')}`,
    lastModified: new Date(createdAt || Date.now()).toISOString(),
    changeFrequency: 'weekly',
  }));

  // Return combined list of URLs (static + dynamic)
  return [...staticUrls, ...dynamicUrls];
}
