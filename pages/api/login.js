import { magicAdmin } from '../../backend/magic';
import jwt from 'jsonwebtoken';
import { createUser, isNewUser } from '../../backend/hasura';
import { setTokenCookie } from '../../backend/cookies';

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers;
      const didToken = authorization.split(' ')[1];
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      const token = jwt.sign(
        {
          ...metadata,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          iat: Math.floor(Date.now() / 1000),
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': metadata.issuer,
          },
        },
        process.env.JWT_SECRET
      );

      const newUser = await isNewUser(token, metadata.issuer);
      if (newUser === true) {
        await createUser(token, metadata);
      }
      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (err) {
      console.log(`Something wenty wrong while logging ${err}`);
      res.status(500).send({ done: false });
    }
  } else {
    res.status(400).send({ done: false });
  }
};
