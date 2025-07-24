import * as argon2 from 'argon2';

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
