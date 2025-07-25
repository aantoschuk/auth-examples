import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

export const hashPassword = async (
  password: string,
): Promise<string | undefined> => {
  if (!password) return;
  const hash = await argon2.hash(password);
  return hash;
};

export const verifyPassword = async (hash: string, password: string) => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    console.error('Error while verifying password: ', err);
    return false;
  }
};

// create refresh token
export const generateRefreshToken = async () => {
  const rawToken = randomBytes(64).toString('hex');
  const hash = await argon2.hash(rawToken);
  return { hash, rawToken };
};

// has access token and compare with stored one
export const verifyRefreshToken = async (token: string, rawToken: string) => {
    return await argon2.verify(token, rawToken)
}
