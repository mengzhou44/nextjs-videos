import videoData from '../data/videos.json';

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

export const getVideos = async (searchQuery) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `${BASE_URL}/search?part=snippet&q=${searchQuery}&type=video&key=${YOUTUBE_API_KEY}&maxResults=25`;

  return await fetchVideos(url);
};

export const getPopularVideos = async () => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `${BASE_URL}/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${YOUTUBE_API_KEY}&maxResults=25`;
  return await fetchVideos(url);
};

export const getVideoById = async (id) => {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const url = `${BASE_URL}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${YOUTUBE_API_KEY}`;

    let res = await fetch(url);
    let data = await res.json();
    if (data.error) {
      console.log(data.error);
      throw new Error(data.error);
    }

    const results = data.items.map((item) => {
      const id = item.id?.videoId || item.id;

      return {
        id,
        title: item.snippet.title,
        description: item.snippet.description,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        publishTime: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
    const video = results.length > 0 ? results[0] : {};
    return video;
  } catch (err) {
    console.error('Youtube API error', { err });
    return {};
  }
};

const fetchVideos = async (url) => {
  try {
    let data = videoData;
    if (process.env.DEVELOPMENT === 'false') {
      const res = await fetch(url);
      data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
    }

    const results = data.items
      .filter((item) => item.id && item.id.videoId)
      .map((item) => {
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          imgUrl: item.snippet.thumbnails.high.url,
          publishTime: item.snippet.publishTime,
          channelTitle: item.snippet.channelTitle,
          statistics: item.statistics ? item.statistics : { viewCount: 0 },
        };
      });

    return results;
  } catch (err) {
    console.error('Youtube API error', { err });
    return [];
  }
};

export const getStats = async ({ videoId }) => {
  try {
    let res = await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
      }),
    });
    res = await res.json();
  } catch (err) {
    console.log(`Error while rating the video.`);
  }
};
