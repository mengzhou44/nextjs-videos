export async function createUser(token, metadata) {
  const operationsDoc = `
  mutation createUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    'createUser',
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  return response;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'isNewUser',
    {
      issuer,
    },
    token
  );

  return response?.data?.users?.length === 0;
}

export async function findVideoByUserId(token, userId, videoId) {
  const operationsDoc = `
  query findVideoByUserId($userId: String!, $videoId: String!) {
  stats(where: {videoId: {_eq: $videoId}, userId: {_eq:$userId }}) {
    id
    favorited
    userId
    videoId
    watched
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'findVideoByUserId',
    {
      userId,
      videoId,
    },
    token
  );

  return response?.data?.stats.length > 0;
}

export async function getStatsByVideoId(token, userId, videoId) {
  const operationsDoc = `
  query findVideoByUserId($userId: String!, $videoId: String!) {
  stats(where: {videoId: {_eq: $videoId}, userId: {_eq:$userId }}) {
    id
    favorited
    userId
    videoId
    watched
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'findVideoByUserId',
    {
      userId,
      videoId,
    },
    token
  );

  let found = response?.data?.stats.length > 0;
  if (!found) {
    return {
      userId,
      videoId,
      favorited: 0,
      watched: false,
    };
  }
  return response?.data?.stats[0];
}

export async function addNewStats(
  token,
  { favorited, userId, videoId, watched }
) {
  const operationsDoc = `
   mutation addNewStats($favorited: Int!, $userId: String!,  $videoId: String!, $watched: Boolean!) {
     insert_stats_one(object: {
        favorited: $favorited, 
        userId: $userId, 
        videoId: $videoId, 
        watched: $watched 
    }) {
      userId
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'addNewStats',
    {
      favorited,
      userId,
      videoId,
      watched,
    },
    token
  );

  console.log(response);
  return response?.data;
}

export async function updateStats(
  token,
  { favorited, userId, videoId, watched }
) {
  const operationsDoc = `
  mutation updateStats($favorited: Int!, $userId: String!,  $videoId: String!, $watched: Boolean!) {
      update_stats(where: {userId: {_eq: $userId},  videoId: {_eq: $videoId}  }, _set: {watched: $watched, favorited: $favorited}) {
      affected_rows
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'updateStats',
    {
      favorited,
      userId,
      videoId,
      watched,
    },
    token
  );

  return response?.data;
}

export async function getMyVideos(token, userId) {
  const operationsDoc = `
  query getMyVideos($userId: String!) {
    stats(where: {userId: {_eq: $userId}, favorited: {_eq: 2}}) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'getMyVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}

export async function getWatchedVideos(token, userId) {
  const operationsDoc = `
  query getWatchedVideos($userId: String!) {
    stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'getWatchedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.HASURA_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
