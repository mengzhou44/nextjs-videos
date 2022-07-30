import { verifyToken } from "./verify-token";

export const useRedirect = async (context) => {
  const token = context.req ? context.req.cookies?.token : null;
  
  const userId = await verifyToken(token);

  return {
    userId,
    token,
  };
};
