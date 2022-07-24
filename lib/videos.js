import videoData from '../data/videos.json';

export const getVideos = async (searchQuery) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet%2CcontentDetails%2Cstatistics&maxResults=25&q=${searchQuery}&key=${YOUTUBE_API_KEY}`;

  return await fetchVideos(url);
};

export const getPopularVideos = async () => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${YOUTUBE_API_KEY}`;

  return await fetchVideos(url);
};

export const getVideoById = async (id) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${YOUTUBE_API_KEY}`;

  let res = await fetch(url);
  let data = await res.json();

  try {
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
        imgUrl: item.snippet.thumbnails.high.url,
        publishTime: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
    return results.length > 0 ? results[0] : {};
  } catch (err) {
    console.error('Youtube API error', { err });
    return [];
  }
};

const fetchVideos = async (url) => {
  //   let res = await fetch(url);
  //   let data = await res.json();
  let data = videoData;
  try {
    if (data.error) {
      console.log(data.error);
      throw new Error(data.error);
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
