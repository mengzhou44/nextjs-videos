import jwt from 'jsonwebtoken';
import {
  findVideoByUserId,
  getStatsByVideoId,
  updateStats,
  addNewStats,
} from '../../backend/hasura';
export default async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const { issuer } = jwt.verify(token, process.env.JWT_SECRET);
      if (req.method === 'POST') {
        const { videoId, watched, favorited } = req.body;
        const doesStatsExists = await findVideoByUserId(token, issuer, videoId);
        if (doesStatsExists) {
          await updateStats(token, {
            favorited,
            userId: issuer,
            videoId,
            watched,
          });
        } else {
          await addNewStats(token, {
            favorited,
            userId: issuer,
            videoId,
            watched,
          });
        }
        res.status(200).send({ doesStatsExists });
      } else {
        const { videoId } = req.query;
        const stats = await getStatsByVideoId(token, issuer, videoId);
        res.status(200).send(stats);
      }
    } else {
      res.status(403);
    }
  } catch (err) {
    console.log(`something went wrong! ${err}`);
    res.status(500).send({ done: false });
  }
};
 