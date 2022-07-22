import videoData from '../data/videos.json';

export const getVideos = async (searchQuery) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchQuery}&key=${YOUTUBE_API_KEY}`;

  return await fetchVideos(url);
};

export const getPopularVideos = async () => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippe&chart=mostPopular&regionCode=US&key=${YOUTUBE_API_KEY}`;

  return await fetchVideos(url);
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
        };
      });
    return results;
  } catch (err) {
    console.error('Youtube API error', { err });
    return [];
  }
};
